using CursorTest.API.Models;
using CursorTest.API.Services;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CursorTest.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BoxesController : ControllerBase
    {
        private readonly ICsvService _csvService;

        public BoxesController(ICsvService csvService)
        {
            _csvService = csvService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Box>> GetBoxes()
        {
            // Read boxes from boxes.csv instead of generating them
            var boxes = _csvService.ReadCsv<Box>("boxes.csv").ToList();
            
            return Ok(boxes);
        }
    }
} 