using CursorTest.API.Models;
using CursorTest.API.Services;
using Microsoft.AspNetCore.Mvc;

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
        public ActionResult<IEnumerable<Image>> GetImages()
        {
            var images = _csvService.ReadCsv<Image>("images.csv");
            return Ok(images);
        }
    }
} 