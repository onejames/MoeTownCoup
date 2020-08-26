import Table from 'cli-table'

module.exports = class outputs {
  logo(){
    console.log(`

___       ___                __________                                    ____
'MMb     dMM'                MMMMMMMMMM                                   6MMMMb/
 MMM.   ,PMM                 /   MM   \                                  8P    YM
 M'Mb   d'MM   _____     ____    MM   _____  ____    _    ___ ___  __   6M      Y   _____  ___   ___ __ ____
 M YM. ,P MM  6MMMMMb   6MMMMb   MM  6MMMMMb 'MM(   ,M.   )M' 'MM 6MMb  MM         6MMMMMb 'MM    MM 'M6MMMMb
 M 'Mb d' MM 6M'   'Mb 6M'  'Mb  MM 6M'   'Mb 'Mb   dMb   d'   MMM9 'Mb MM        6M'   'Mb MM    MM  MM'  'Mb
 M  YM.P  MM MM     MM MM    MM  MM MM     MM  YM. ,PYM. ,P    MM'   MM MM        MM     MM MM    MM  MM    MM
 M  'Mb'  MM MM     MM MMMMMMMM  MM MM     MM  'Mb d''Mb d'    MM    MM MM        MM     MM MM    MM  MM    MM
 M   YP   MM MM     MM MM        MM MM     MM   YM,P  YM,P     MM    MM YM      6 MM     MM MM    MM  MM    MM
 M   ''   MM YM.   ,M9 YM    d9  MM YM.   ,M9   'MM'  'MM'     MM    MM  8b    d9 YM.   ,M9 YM.   MM  MM.  ,M9
_M_      _MM_ YMMMMM9   YMMMM9  _MM_ YMMMMM9     YP    YP     _MM_  _MM_  YMMMM9   YMMMMM9   YMMM9MM_ MMYMMM9
                                                                                                      MM
                                                                                                      MM
              V 0.0.2                                                                                _MM_      `)
    }

  configTable(config) {
    const table = new Table()
    for (const [key, value] of Object.entries(config)) {
      if(value instanceof Object) {
        table.push({key: JSON.stringify(value)})
      } else {
        table.push({key: value})
      }
    }
    console.log(table.toString())
  }

  spinner(string='Waiting..') {
    var Spinner = require('cli-spinner').Spinner
    var cliSpinners = require('cli-spinners')

    var spinner = new Spinner(string+' %s')
    spinner.setSpinnerString(cliSpinners.random)

    return spinner
  }
}
