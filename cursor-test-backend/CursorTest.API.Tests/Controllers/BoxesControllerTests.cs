using NUnit.Framework;
using Moq;
using CursorTest.API.Controllers;
using CursorTest.API.Services;
using CursorTest.API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace CursorTest.API.Tests.Controllers
{
    [TestFixture]
    public class BoxesControllerTests
    {
        private Mock<ICsvService> _mockCsvService;
        private BoxesController _controller;
        private List<Box> _testBoxes;

        [SetUp]
        public void Setup()
        {
            _mockCsvService = new Mock<ICsvService>();
            _controller = new BoxesController(_mockCsvService.Object);
            
            // Setup test data
            _testBoxes = new List<Box>
            {
                new Box { Id = 1, Name = "Box1" },
                new Box { Id = 2, Name = "Box2" },
                new Box { Id = 3, Name = "Box3" }
            };
        }

        [Test]
        public void GetBoxes_ReturnsAllBoxes()
        {
            // Arrange
            _mockCsvService.Setup(s => s.ReadCsv<Box>("boxes.csv"))
                .Returns(_testBoxes);

            // Act
            var result = _controller.GetBoxes();

            // Assert
            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());
            var okResult = result.Result as OkObjectResult;
            var boxes = okResult.Value as List<Box>;
            Assert.That(boxes.Count, Is.EqualTo(3));
            Assert.That(boxes.Select(b => b.Id), Is.EquivalentTo(new[] { 1, 2, 3 }));
        }

        [Test]
        public void GetBoxes_ReturnsEmptyList_WhenNoBoxesExist()
        {
            // Arrange
            _mockCsvService.Setup(s => s.ReadCsv<Box>("boxes.csv"))
                .Returns(new List<Box>());

            // Act
            var result = _controller.GetBoxes();

            // Assert
            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());
            var okResult = result.Result as OkObjectResult;
            var boxes = okResult.Value as List<Box>;
            Assert.That(boxes, Is.Empty);
        }
    }
} 