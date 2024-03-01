import * as fs from "node:fs";

async function getWorlds(){
    const validTags = ["world", "social", "game", "misc", "avatar", "avatars", "other", "tau", "art", "esd", "meme", "narrative"];
    const searchData = JSON.stringify(
        {
            "count": 500,
            "recordType": "world",
            "submittedTo": "G-Resonite",
            "requiredTags": ["mmc24"]
        }
    );
    const response = await fetch("https://api.resonite.com/records/pagedSearch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"  
        },
        body: searchData
    });

    const fetchedWorlds = await response.json();

    let sheetData = "";
    fetchedWorlds.records.forEach(world => {
        // RegEx explained:
        // "/<" = Starts with <
        // "\/?" = May contain a /
        // "[^>]+" = one or more characters that isn't >
        // "(>|$)/g" = ends with > or a new line
        const formattedWorldName = world.name.replace(/<\/?[^>]+(>|$)/g, "");
        let formattedTags = "";
        let worldTags = world.tags;
        worldTags.sort();
        worldTags.forEach(tag => {
            if (validTags.indexOf(tag) > -1){
                formattedTags += `${tag} `;
            }
        });
        sheetData += `"${formattedWorldName}",${world.ownerName},${formattedTags.trimEnd()},resrec:///${world.ownerId}/${world.id}\n`;
    });
    fs.writeFileSync("result.csv", sheetData.trimEnd());
}

getWorlds();