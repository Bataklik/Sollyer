using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Bedrijven",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Naam = table.Column<string>(type: "TEXT", nullable: false),
                    Locatie = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bedrijven", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sollicitaties",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    BedrijfInfoId = table.Column<int>(type: "INTEGER", nullable: false),
                    Datum = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    SStatus = table.Column<int>(type: "integer", nullable: false),
                    Link = table.Column<string>(type: "text", nullable: true),
                    Notities = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sollicitaties", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Sollicitaties_Bedrijven_BedrijfInfoId",
                        column: x => x.BedrijfInfoId,
                        principalTable: "Bedrijven",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Bedrijven",
                columns: new[] { "Id", "Locatie", "Naam" },
                values: new object[,]
                {
                    { 1, "Gent", "Eniris" },
                    { 2, "Gent", "Nuanso" }
                });

            migrationBuilder.InsertData(
                table: "Sollicitaties",
                columns: new[] { "Id", "BedrijfInfoId", "Datum", "Link", "Notities", "Status" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(2026, 3, 10, 0, 0, 0, 0, DateTimeKind.Utc), "https://eniris.io/", "Vorige stageplek", 1 },
                    { 2, 2, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc), "https://www.nuanso.io/", "AI advertising project", 2 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Sollicitaties_BedrijfInfoId",
                table: "Sollicitaties",
                column: "BedrijfInfoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Sollicitaties");

            migrationBuilder.DropTable(
                name: "Bedrijven");
        }
    }
}
