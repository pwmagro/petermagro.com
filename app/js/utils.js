const fs = require("fs");
let siteMap = JSON.parse('{}');

module.exports = {
    buildSiteMap: function () {
        _buildSiteMap();
        return siteMap;
    }
}

function _reorg(path) {
    let hier = path.replace('./app/md', '');
    let fullName = hier.split(/[\/\\]/).at(-1);
    let name = null;
    let num = null;
    let type = null;
    let markdownFile = null;

    if (fullName.includes('.')) {
        [num, name] = fullName.split('.', 2);
        if (Number(num))
            num = Number(num);
        else
            num = num.toLowerCase();
    }
    else {
        name = fullName;
    }

    hier = hier.replace(/(\d+\.)|hide\./, '');

    pathStat = fs.statSync(path);
    // node is a directory
    if (pathStat.isDirectory()) {
        let children = fs.readdirSync(path);
        let childDirs = {}
        let files = []
        children.forEach(function (child) {
            let fullPath = path + '/' + child;
            let childStat = fs.statSync(fullPath);
            let reorg = _reorg(fullPath);
            if (childStat.isDirectory()) {
                childDirs[reorg.name] = reorg;
            }
            else {
                let ext = child.split('.').at(-1);
                if (ext == 'md') {
                    type = child.slice(0, -3);
                    if (type == 'external') {
                        let link = fs.readFileSync(fullPath).toString();
                        hier = link;
                    }
                    markdownFile = fullPath;
                }
                else {
                    files.push(reorg);
                }
            }
        });

        let retDict = {}
        if (name) retDict['name'] = name;
        if (num)  retDict['num'] = num;
        if (type) retDict['type'] = type;
        if (hier) retDict['hier'] = hier;
        if (markdownFile) retDict['markdownFile'] = markdownFile;
        if (files.length > 0) retDict['files'] = files;
        if (Object.keys(childDirs).length > 0) retDict['pages'] = childDirs; 
        return retDict;
    }
    else {
        return path;
    }
}

function _buildSiteMap() {
    root = './app/md';
    siteMap =  _reorg(root);
    siteMap['top'] = {
        name: "home",
        type: "default",
        markdownFile: "./app/md/1.home/default.md"
    };
    console.log(JSON.stringify(siteMap,undefined,2));
}