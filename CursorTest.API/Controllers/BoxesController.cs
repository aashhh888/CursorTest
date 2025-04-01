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
            // Read unique boxes from images.csv
            var images = _csvService.ReadCsv<Image>("images.csv");
            var uniqueBoxes = new HashSet<int>(images.Select(i => i.Box));

            // Update boxes.csv if needed
            var boxes = uniqueBoxes.Select(id => new Box { Id = id, Name = $"Box {id}" })
                                 .OrderBy(b => b.Id)
                                 .ToList();
            
            _csvService.WriteCsv("boxes.csv", boxes);

            return Ok(boxes);
        }
    }
} 