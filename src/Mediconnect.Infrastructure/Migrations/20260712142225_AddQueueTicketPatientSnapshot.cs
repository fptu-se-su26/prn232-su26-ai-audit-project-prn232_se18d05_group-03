using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mediconnect.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddQueueTicketPatientSnapshot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PatientId",
                table: "QueueTickets",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PatientName",
                table: "QueueTickets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_QueueTickets_PatientId",
                table: "QueueTickets",
                column: "PatientId");

            migrationBuilder.AddForeignKey(
                name: "FK_QueueTickets_PatientProfiles_PatientId",
                table: "QueueTickets",
                column: "PatientId",
                principalTable: "PatientProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QueueTickets_PatientProfiles_PatientId",
                table: "QueueTickets");

            migrationBuilder.DropIndex(
                name: "IX_QueueTickets_PatientId",
                table: "QueueTickets");

            migrationBuilder.DropColumn(
                name: "PatientId",
                table: "QueueTickets");

            migrationBuilder.DropColumn(
                name: "PatientName",
                table: "QueueTickets");
        }
    }
}
