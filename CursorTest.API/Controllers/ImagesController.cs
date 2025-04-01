using CursorTest.API.Models;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using CsvHelper;
using System.Globalization;

namespace CursorTest.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImagesController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;

        public ImagesController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Image>> GetImages()
        {
            var csvPath = Path.Combine(_environment.ContentRootPath, "Data", "images.csv");
            
            using (var reader = new StreamReader(csvPath))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                var images = csv.GetRecords<Image>().ToList();
                return Ok(images);
            }
        }
    }
} 