'use strict';

const map = {
  'action': {
    'set.vm.power_on': 'Power On',
    'set.vm.power_off': 'Power Off',
    'set.vm.power_reboot': 'Reboot',
    'set.vm.power_suspend': 'Suspend',
    'set.vm.power_resume': 'Resume',
    'do.vm.destroy': 'Destroy'
  }
};

const babel = (collection, key) => {
  return map[collection][key] ? map[collection][key] : `!!! ${collection}=>${key} !!!`;
};
