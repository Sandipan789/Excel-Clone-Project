let downloadBtn = document.querySelector(".download");

// Download Task
downloadBtn.addEventListener("click", (e) => {
    let jsonData = JSON.stringify([cellDB, graphComponent]);
    let file = new Blob([jsonData], { type: "application/json" });

    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "SheetData.json";
    a.click();
})