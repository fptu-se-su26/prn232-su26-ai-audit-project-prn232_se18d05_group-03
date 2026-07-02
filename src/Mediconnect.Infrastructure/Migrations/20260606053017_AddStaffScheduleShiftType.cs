using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mediconnect.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddStaffScheduleShiftType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_StaffSchedules_StaffId",
                table: "StaffSchedules");

            migrationBuilder.AddColumn<int>(
                name: "ShiftType",
                table: "StaffSchedules",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "WorkRoom",
                table: "StaffSchedules",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_StaffSchedules_StaffId_ShiftDate_ShiftType",
                table: "StaffSchedules",
                columns: new[] { "StaffId", "ShiftDate", "ShiftType" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_StaffSchedules_StaffId_ShiftDate_ShiftType",
                table: "StaffSchedules");

            migrationBuilder.DropColumn(
                name: "ShiftType",
                table: "StaffSchedules");

            migrationBuilder.DropColumn(
                name: "WorkRoom",
                table: "StaffSchedules");

            migrationBuilder.CreateIndex(
                name: "IX_StaffSchedules_StaffId",
                table: "StaffSchedules",
                column: "StaffId");
        }
    }
}
