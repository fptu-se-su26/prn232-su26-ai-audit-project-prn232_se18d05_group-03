using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mediconnect.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddServiceRating : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ServiceRatings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PatientId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DoctorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OutpatientVisitId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Score = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceRatings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ServiceRatings_OutpatientVisits_OutpatientVisitId",
                        column: x => x.OutpatientVisitId,
                        principalTable: "OutpatientVisits",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ServiceRatings_PatientProfiles_PatientId",
                        column: x => x.PatientId,
                        principalTable: "PatientProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ServiceRatings_StaffProfiles_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "StaffProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ServiceRatings_DoctorId",
                table: "ServiceRatings",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceRatings_OutpatientVisitId",
                table: "ServiceRatings",
                column: "OutpatientVisitId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceRatings_PatientId",
                table: "ServiceRatings",
                column: "PatientId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ServiceRatings");
        }
    }
}
