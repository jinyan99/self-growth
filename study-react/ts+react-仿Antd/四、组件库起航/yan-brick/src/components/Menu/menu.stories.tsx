import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Menu from './menu'
import MenuItem from './menuItem'
import SubMenu from './subMenu';

export const defaultMenu = () => (
  <Menu defaultIndex='0' onSelect={(index) => {action(`clicked ${index} item`)}} >
    <MenuItem>
      cool link
    </MenuItem>
    <SubMenu title="cool more">
        <MenuItem>
            cool link1
        </MenuItem>
        <MenuItem>
            cool link2
        </MenuItem>
    </SubMenu>
    <MenuItem disabled>
      disabled
    </MenuItem>
    <MenuItem>
      cool link 2
    </MenuItem>
  </Menu>
)

storiesOf('Menu Component', module)
.add('Menu', defaultMenu )