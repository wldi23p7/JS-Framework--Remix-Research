const fs = require('fs')

let processDir = function (dir = `./Src/`) {
  dir[dir.length - 1] != '/' && (dir = dir + '/')

  try {
    
    let f = fs.readdirSync(dir).map(f => ({ name: f, path: dir + f, stat: fs.statSync(dir + f) }))    
    
    f.map(f => {
      console.log(f.path, f.name)
      if (!!f.stat.isDirectory()) {
          if (f.name == '.git') {
            fs.renameSync(f.path, f.path + '_')
            return
          }
          
          
          processDir(f.path)
        }
      })

    } catch (error) {
    }
}

processDir()