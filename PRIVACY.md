# YouTube Emote Downloader Privacy Policy
## Intro
This extension does not collect any data at all. However, it does have behaviour that Google deems as "handling sensitive data," and so [requires](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq) this privacy policy.

## Activation
This extension activates whenever you visit any page on "https://youtube.com" or "https://www.youtube.com". It looks for any instance of a block that shows channel-specific emojis (e.g. on the Join modal or Membership tab of a YouTube channel. If this block doesn't exist, no further action is taken. If this block is found, a button will be inserted into the page at the end of this block that lets the user download the icons in that block. When the user clicks on this button, the icons are downloaded into memory, a zip file is created, and then the file is saved using the Download API as if the user clicked on a download link.

## Data Collection
As mentioned above, no data is ever collected. The only data that is ever persisted is the icons the user chooses to save to their drive.

## Source Code
This extension is open source. The complete source code may be found at https://github.com/kylemsguy/yt-emotes-extractor
