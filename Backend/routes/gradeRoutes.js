// ------------------- Existing routes -------------------
// app.post("/api/upload-grades/:type", ... )
// app.post("/api/update-grades/:type", ... )

// ------------------- Generate Excel Template -------------------
app.get("/api/download-template/:type", (req, res) => {
  const { type } = req.params;
  const { faculty, department, level, semester } = req.query;

  if (!type || !faculty || !department || !level || !semester) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  const ws_data = [
    ["RegistrationNumber", "SubjectCode", "Grade"],
    ["", "", ""],
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, "Template");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${type}_${faculty}_${department}.xlsx`
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.send(buffer);
});

// ------------------- Start server -------------------
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
