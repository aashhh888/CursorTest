using CsvHelper;
using System.Globalization;

namespace CursorTest.API.Services
{
    public class CsvService : ICsvService
    {
        private readonly IWebHostEnvironment _environment;

        public CsvService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public List<T> ReadCsv<T>(string fileName)
        {
            var filePath = Path.Combine(_environment.ContentRootPath, "Data", fileName);
            using var reader = new StreamReader(filePath);
            using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
            return csv.GetRecords<T>().ToList();
        }

        public void WriteCsv<T>(string fileName, IEnumerable<T> records)
        {
            var filePath = Path.Combine(_environment.ContentRootPath, "Data", fileName);
            using var writer = new StreamWriter(filePath);
            using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
            csv.WriteHeader<T>();
            csv.NextRecord();
            csv.WriteRecords(records);
        }
    }
} 