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
    public class ImagesControllerTests
    {
        private Mock<ICsvService> _mockCsvService;
        private ImagesController _controller;
        private List<Image> _testImages;

        [SetUp]
        public void Setup()
        {
            _mockCsvService = new Mock<ICsvService>();
            _controller = new ImagesController(_mockCsvService.Object);
            
            // Setup test data
            _testImages = new List<Image>
            {
                new Image { Id = 1, Title = "Image1", Box = 1, ImageUrl = "https://example.com/image1.jpg" },
                new Image { Id = 2, Title = "Image2", Box = 1, ImageUrl = "https://example.com/image2.jpg" },
                new Image { Id = 3, Title = "Image3", Box = 2, ImageUrl = "https://example.com/image3.jpg" },
                new Image { Id = 4, Title = "Image4", Box = 2, ImageUrl = "https://example.com/image4.jpg" }
            };
        }

        [Test]
        public void GetImages_ReturnsAllImages_WhenNoFilterApplied()
        {
            // Arrange
            var parameters = new PaginationParameters { PageNumber = 1, PageSize = 10 };
            _mockCsvService.Setup(s => s.ReadCsv<Image>("images.csv"))
                .Returns(_testImages);

            // Act
            var result = _controller.GetImages(parameters);

            // Assert
            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());
            var okResult = result.Result as OkObjectResult;
            var response = okResult.Value as PagedResponse<Image>;
            Assert.That(response.Data.Count(), Is.EqualTo(4));
            Assert.That(response.TotalCount, Is.EqualTo(4));
        }

        [Test]
        public void GetImages_ReturnsFilteredImages_WhenBoxFilterApplied()
        {
            // Arrange
            var parameters = new PaginationParameters { PageNumber = 1, PageSize = 10, BoxFilter = 1 };
            _mockCsvService.Setup(s => s.ReadCsv<Image>("images.csv"))
                .Returns(_testImages);

            // Act
            var result = _controller.GetImages(parameters);

            // Assert
            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());
            var okResult = result.Result as OkObjectResult;
            var response = okResult.Value as PagedResponse<Image>;
            Assert.That(response.Data.Count(), Is.EqualTo(2));
            Assert.That(response.TotalCount, Is.EqualTo(2));
            Assert.That(response.Data.All(i => i.Box == 1), Is.True);
        }

        [Test]
        public void GetImages_ReturnsPaginatedResults_WhenPageSizeIsLessThanTotal()
        {
            // Arrange
            var parameters = new PaginationParameters { PageNumber = 2, PageSize = 2 };
            _mockCsvService.Setup(s => s.ReadCsv<Image>("images.csv"))
                .Returns(_testImages);

            // Act
            var result = _controller.GetImages(parameters);

            // Assert
            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());
            var okResult = result.Result as OkObjectResult;
            var response = okResult.Value as PagedResponse<Image>;
            Assert.That(response.Data.Count(), Is.EqualTo(2));
            Assert.That(response.TotalCount, Is.EqualTo(4));
            Assert.That(response.PageNumber, Is.EqualTo(2));
            Assert.That(response.PageSize, Is.EqualTo(2));
        }
    }
} 