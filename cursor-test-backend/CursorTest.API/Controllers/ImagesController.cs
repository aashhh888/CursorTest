using CursorTest.API.Models;
using CursorTest.API.Services;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CursorTest.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImagesController : ControllerBase
    {
        private readonly ICsvService _csvService;

        public ImagesController(ICsvService csvService)
        {
            _csvService = csvService;
        }

        [HttpGet]
        public ActionResult<PagedResponse<Image>> GetImages([FromQuery] PaginationParameters parameters)
        {
            var allImages = _csvService.ReadCsv<Image>("images.csv");
            
            // Apply box filtering if specified
            if (parameters.BoxFilter.HasValue)
            {
                allImages = allImages.Where(img => img.Box == parameters.BoxFilter.Value).ToList();
            }

            var totalCount = allImages.Count;
            
            // Apply pagination
            var pagedImages = allImages
                .Skip((parameters.PageNumber - 1) * parameters.PageSize)
                .Take(parameters.PageSize)
                .ToList();

            var response = new PagedResponse<Image>(
                pagedImages,
                parameters.PageNumber,
                parameters.PageSize,
                totalCount
            );

            return Ok(response);
        }
    }
} 