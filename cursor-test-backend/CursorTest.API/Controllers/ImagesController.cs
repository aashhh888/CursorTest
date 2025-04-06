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
        public ActionResult<PagedResponse<ImageDto>> GetImages([FromQuery] PaginationParameters parameters)
        {
            var images = _csvService.ReadCsv<Image>("images.csv");
            var collections = _csvService.ReadCsv<Collection>("collection.csv");
            
            // Join the data from both CSVs
            var allImages = collections.Join(
                images,
                collection => collection.ImageId,
                img => img.Id,
                (collection, img) => new ImageDto
                {
                    Id = collection.Id,
                    Title = img.Title,
                    ImageUrl = img.ImageUrl,
                    Box = collection.Box,
                    HP = collection.HP,
                    Atk = collection.Atk,
                    Def = collection.Def,
                    SPAtk = collection.SPAtk,
                    SPDef = collection.SPDef,
                    Speed = collection.Speed
                }
            ).ToList();
            
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

            var response = new PagedResponse<ImageDto>(
                pagedImages,
                parameters.PageNumber,
                parameters.PageSize,
                totalCount
            );

            return Ok(response);
        }
    }
} 