using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSeedLinks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Sollicitaties",
                keyColumn: "Id",
                keyValue: 1,
                column: "Link",
                value: "https://eniris.io/");

            migrationBuilder.UpdateData(
                table: "Sollicitaties",
                keyColumn: "Id",
                keyValue: 2,
                column: "Link",
                value: "https://www.nuanso.io/");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Sollicitaties",
                keyColumn: "Id",
                keyValue: 1,
                column: "Link",
                value: null);

            migrationBuilder.UpdateData(
                table: "Sollicitaties",
                keyColumn: "Id",
                keyValue: 2,
                column: "Link",
                value: null);
        }
    }
}
