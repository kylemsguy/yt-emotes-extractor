window.addEventListener("load", main, false);
window.addEventListener("initiateDownload", function (e) {
    download(e);
});

const memberBadgeNames = [
    "New-member badge",
    "Month 1 badge",
    "Month 2 badge",
    "Month 6 badge",
    "Month 12 badge",
    "Month 24 badge"
]

// TODO: allow downloading icons by clicking on extension icon
// TODO: Allow disabling adding the download button to the page (since this adds an interval)

let jsInitChecktimer = null;

function main() {
    jsInitChecktimer = setInterval(addDownloadButtons, 1000);
}

function getFullSizeImgUrl(url) {
    return url.split("=").slice(0, -1).join("=");
}

function getIconNameFromAlt(alttext, index) {
    if (alttext === "Custom badge for members") {
        alttext = null;
    }
    return alttext || memberBadgeNames[index] || "Index(" + index.toString() + ")";
}

function extractUrls(imgs) {
    let img = null;
    const urls = [];
    for (let i = 0; i < imgs.snapshotLength; i++) {
        const img = imgs.snapshotItem(i);
        // console.log("url: " + img.src)
        // if alt text is empty, we'll need to get the data from the index :)
        // console.log("alt: " + img.alt);
        urls.push({
            "url": getFullSizeImgUrl(img.src),
            "filename": getIconNameFromAlt(img.alt, i) + ".png"
        });
    }
    return urls;
}

function addDownloadButtons() {
    const iconContainerXPath = "//ytd-sponsorships-perk-renderer[descendant::img]";
    const iconContainers = document.evaluate(iconContainerXPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (iconContainers.snapshotLength !== 0) {
        // console.log("bye rosemi");
        clearInterval(jsInitChecktimer);
        jsInitChecktimer = null;
    }
    for (let i = 0; i < iconContainers.snapshotLength; i++) {
        const container = iconContainers.snapshotItem(i);
        const titleResult = document.evaluate(".//yt-formatted-string[@id=\"title\"]/text()", container, null, XPathResult.STRING_TYPE, null);
        const sectionTitle = titleResult.stringValue || "";
        const header = sectionTitle.split(" ").slice(0, 2).join(" ") || "unknown";

        // console.log(container);
        const btnDownload = document.createElement("button");
        btnDownload.innerText = "Download icons!";
        btnDownload.addEventListener("click", (e) => {
            downloadIcons(container, header);
        });
        container.appendChild(btnDownload);
    }
}

function downloadIcons(container, header) {
    const channelHandle = document.getElementById("channel-handle").innerText;
    const folderName = channelHandle + "-" + header + "-icons";
    // the leading '.' in the xpath is key, otherwise it searches the entire document.
    const imgsContainer = document.evaluate(".//img", container, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const imgs = extractUrls(imgsContainer);

    const zip = new JSZip();
    const iconZip = zip.folder(folderName);

    const promises = []

    for (let i = 0; i < imgs.length; i++) {
        const iconObj = imgs[i];
        const url = iconObj.url;
        const filename = iconObj.filename;
        // 1) get a promise of the content
        var promise = new JSZip.external.Promise(function (resolve, reject) {
            JSZipUtils.getBinaryContent(url, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });

        promises.push(promise);

        promise.then(function (img) {
            // console.log(filename);
            return iconZip.file(filename, img); // 3) chain with the text content promise
        })
            .then(function success(text) {                    // 4) display the result
                // console.log("Successfully added file " + filename + " to the zip");
            }, function error(e) {
                console.log("Failed to save " + filename);
                console.log(e);
            });
    }

    Promise.all(promises).then(function () {
        zip.generateAsync({
            type: "blob",
            compression: "DEFLATE"
        }).then(function (blob) { // 1) generate the zip file
            // TODO: detect whether we're downloading membership or icons and rename accordingly
            saveAs(blob, folderName + ".zip");                          // 2) trigger the download
        }, function (err) {
            alert("Failed. See the log for details.");
            console.log(err);
        });
    });
}