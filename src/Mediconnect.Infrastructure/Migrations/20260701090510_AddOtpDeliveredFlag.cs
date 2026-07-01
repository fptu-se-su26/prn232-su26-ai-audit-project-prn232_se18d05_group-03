using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mediconnect.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddOtpDeliveredFlag : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Delivered",
                table: "OtpCodes",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Delivered",
                table: "OtpCodes");
        }
    }
}
