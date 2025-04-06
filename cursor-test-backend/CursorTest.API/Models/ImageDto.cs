namespace CursorTest.API.Models
{
    public class ImageDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string ImageUrl { get; set; }
        public int Box { get; set; }
        public int? HP { get; set; }
        public int? Atk { get; set; }
        public int? Def { get; set; }
        public int? SPAtk { get; set; }
        public int? SPDef { get; set; }
        public int? Speed { get; set; }
    }
} 