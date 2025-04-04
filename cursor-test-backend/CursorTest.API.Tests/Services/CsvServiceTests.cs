using NUnit.Framework;
using Moq;
using CursorTest.API.Services;
using Microsoft.AspNetCore.Hosting;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace CursorTest.API.Tests.Services
{
    [TestFixture]
    public class CsvServiceTests
    {
        private Mock<IWebHostEnvironment> _mockEnvironment;
        private CsvService _csvService;
        private string _testDirectory;

        [SetUp]
        public void Setup()
        {
            _testDirectory = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName());
            Directory.CreateDirectory(Path.Combine(_testDirectory, "Data"));

            _mockEnvironment = new Mock<IWebHostEnvironment>();
            _mockEnvironment.Setup(e => e.ContentRootPath).Returns(_testDirectory);
            
            _csvService = new CsvService(_mockEnvironment.Object);
        }

        [TearDown]
        public void TearDown()
        {
            if (Directory.Exists(_testDirectory))
            {
                Directory.Delete(_testDirectory, true);
            }
        }

        public class TestRecord
        {
            public int Id { get; set; }
            public string Name { get; set; }
        }

        [Test]
        public void ReadCsv_ReturnsCorrectData_WhenFileExists()
        {
            // Arrange
            var testData = "Id,Name\n1,Test1\n2,Test2";
            var filePath = Path.Combine(_testDirectory, "Data", "test.csv");
            File.WriteAllText(filePath, testData);

            // Act
            var result = _csvService.ReadCsv<TestRecord>("test.csv");

            // Assert
            Assert.That(result.Count, Is.EqualTo(2));
            Assert.That(result[0].Id, Is.EqualTo(1));
            Assert.That(result[0].Name, Is.EqualTo("Test1"));
            Assert.That(result[1].Id, Is.EqualTo(2));
            Assert.That(result[1].Name, Is.EqualTo("Test2"));
        }

        [Test]
        public void WriteCsv_WritesCorrectData()
        {
            // Arrange
            var records = new List<TestRecord>
            {
                new TestRecord { Id = 1, Name = "Test1" },
                new TestRecord { Id = 2, Name = "Test2" }
            };

            // Act
            _csvService.WriteCsv("test.csv", records);

            // Assert
            var filePath = Path.Combine(_testDirectory, "Data", "test.csv");
            Assert.That(File.Exists(filePath), Is.True);
            
            var lines = File.ReadAllLines(filePath);
            Assert.That(lines.Length, Is.EqualTo(3)); // Header + 2 records
            Assert.That(lines[0], Is.EqualTo("Id,Name"));
            Assert.That(lines[1], Is.EqualTo("1,Test1"));
            Assert.That(lines[2], Is.EqualTo("2,Test2"));
        }

        [Test]
        public void ReadCsv_ThrowsFileNotFoundException_WhenFileDoesNotExist()
        {
            Assert.Throws<FileNotFoundException>(() => _csvService.ReadCsv<TestRecord>("nonexistent.csv"));
        }
    }
} 