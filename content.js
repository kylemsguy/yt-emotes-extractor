window.addEventListener("load", main, false);
window.addEventListener("initiateDownload", function (e)
{
    download(e);
});

let jsInitChecktimer = null;

function main(){
    addDownloadButtons();
    jsInitChecktimer = setInterval(addDownloadButtons, 1000);
}

function extractUrls(imgs) {
    let img = null;
    const urls = [];
    while ((img = imgs.iterateNext())) {
        console.log("Url: " + img.src + " alt: " + img.alt);
        if (img.src !== ''){
            urls.push(img.src);
        }
    }
    return urls;
}

function addDownloadButtons() {
    const iconContainerXPath = "//ytd-sponsorships-perk-renderer[descendant::img]";
    const iconContainers = document.evaluate(iconContainerXPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (iconContainers.snapshotLength !== 0) {
        console.log("bye rosemi");
        clearInterval(jsInitChecktimer);
        jsInitChecktimer = null;
    }
    for (let i = 0; i < iconContainers.snapshotLength; i++) {
        let container = iconContainers.snapshotItem(i);
        console.log(container);
        const btnDownload = document.createElement("button");
        btnDownload.innerText = "Download icons!";
        btnDownload.addEventListener("click",  (e) => {
            downloadIcons(container);
        });
        container.appendChild(btnDownload);
    }
}

function downloadIcons(container){
    // the leading '.' in the xpath is key, otherwise it searches the entire document.
    const imgs = document.evaluate(".//img", container, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0; i < imgs.snapshotLength; i++) {
        let img = imgs.snapshotItem(i);
        console.log(img);
        if (img !== null) {
            console.log("url: " + img.src)
            // if alt text is empty, we'll need to get the data from the index :)
            console.log("alt: " + img.alt);
        }
    }

    // alert("You have clicked download");

    return;

    const filename_map = {};


    for(let i = 0; i < previews.length; i++){
        filename_map[filename] = url;
    }

    const zip = new JSZip();
    const photoZip = zip.folder("photos");

    const promises = []

    for(let prop in filename_map){
        if(!filename_map.hasOwnProperty(prop)) continue;

        const url = filename_map[prop];
        // 1) get a promise of the content
        var promise = new JSZip.external.Promise(function (resolve, reject) {
            JSZipUtils.getBinaryContent(url, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });

        promises.push(promise);

        promise.then(function(img) {
            // console.log(prop);
            return photoZip.file(prop, img); // 3) chain with the text content promise
        })
        .then(function success(text) {                    // 4) display the result
            // console.log("Successfully added file " + prop + " to the zip");
        }, function error(e) {
            console.log("Failed to save " + prop);
            console.log(e);
        });
    }

    Promise.all(promises).then(function(){
        zip.generateAsync({
            type:"blob", 
            compression: "DEFLATE"
        }).then(function (blob) { // 1) generate the zip file
            saveAs(blob, "photos.zip");                          // 2) trigger the download
        }, function (err) {
            alert("Failed. See the log for details.");
            console.log(err);
        });
    });
}