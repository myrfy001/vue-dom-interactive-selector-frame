

const HOVER_STYLE_NAME_PREFIX = '-interactive-dom-selector-injected-style-highlight-mouse-hover'
const SELECTED_STYLE_NAME_PREFIX = '-interactive-dom-selector-injected-style-highlight-selected'
const default_config = {
    'group': {
        'group1':{
            'selected_style': '{outline:2px solid red!important; background-color:#ff00000a}',
            'hover_style': '{outline:2px solid green!important}'
        },
        'group2':{
            'selected_style': '{outline:2px solid blue!important; background-color:#0000ff0a}',
            'hover_style': '{outline:2px solid yellow!important}'
        }
    },
    'shortcut_key':{
        'move_to_parent':'p',
        'click':'c'
    }
}

export class InteractiveSelector {

    constructor(ifwindow, change_callback, config){
        this.ifwindow = ifwindow
        this.ifdocument = ifwindow.document
        this._selected_node = {}
        this._current_node = null
        this.config = config || default_config
        this.cur_group = Object.keys(this.config.group)[0]
        for (const key of Object.keys(this.config.group)){
            this._selected_node[key] = []
        }
        this.change_callback = change_callback
    }

    get selected_node() {return this._selected_node}
    set selected_node(nodes) {
        this._selected_node=nodes;
        this.update_selected_style()
        console.log('set-----')
    }

    inject() {
        this.inject_style()
        this.ifdocument.addEventListener('mouseover', this.mouseover_handler.bind(this), { capture: true })
        this.ifdocument.addEventListener('mouseout', this.mouseout_handler.bind(this), { capture: true })
        this.ifdocument.addEventListener('click', this.mouseclick_handler.bind(this), { capture: true })
        this.ifdocument.addEventListener('keydown', this.keydown_handler.bind(this), { capture: true });
          
    }

    get_style_name(group_name, typ){
        if (typ === 'hover') {
            return `${HOVER_STYLE_NAME_PREFIX}-${group_name}`
        }else if (typ === 'select') {
            return `${SELECTED_STYLE_NAME_PREFIX}-${group_name}`
        }  
    }

    inject_style() {
        var n = this.ifdocument.createElement('style')
        let html_piece = ''
        for (let [name, group] of Object.entries(this.config.group)){
            // Must make hover comes after selected so hover have a higher priority in CSS
            html_piece += `.${this.get_style_name(name, 'select')}${group.selected_style}\n`
            html_piece += `.${this.get_style_name(name, 'hover')}${group.hover_style}\n`
        }
        n.innerHTML = html_piece
        this.ifdocument.body.appendChild(n)
    }

    modify_highlight(node, typ, action, group) {

        var style_to_modify = this.get_style_name(group, typ)
        if (action === 'add') {
            node.classList.add(style_to_modify)
        } else if (action === 'remove'){
            node.classList.remove(style_to_modify)
        }
    }

    remove_all_highlight() {
        for (const group_name of Object.keys(this.config.group)){
            // Make a copy of query result because the result will change when
            // class is modified, which makes the for loop below unstable
            let old_selected = Array.from(this.ifdocument.getElementsByClassName(
                this.get_style_name(group_name, 'select')
                ))
            
            for (var element of old_selected){
                this.modify_highlight(element, 'select', 'remove', group_name)
            }
        }
    }


    mouseover_handler(e) {
        e.preventDefault()
        if (this._current_node !== null){
            this.modify_highlight(this._current_node,'hover','remove', this.cur_group)
        }
        this.modify_highlight(e.target,'hover','add', this.cur_group)
        this._current_node = e.target
        this.ifwindow.focus()
    }
    mouseout_handler(e) {
        e.preventDefault()
        this.modify_highlight(e.target,'hover','remove', this.cur_group)
    }

    mouseclick_handler(e) {
        e.preventDefault()
        this._current_node = e.target
        this.toggle_select()
    }

    toggle_select(){
        const node = this._current_node
        const cur_group_selected = this._selected_node[this.cur_group]
        const selected_idx = cur_group_selected.indexOf(node)
        if ( selected_idx === -1){
            cur_group_selected.push(node)
        }else{
            cur_group_selected.splice(selected_idx, 1)
        }
        this.update_selected_style()
        this.change_callback()
    }

    keydown_handler(e) {
        e.preventDefault()
        if (e.key === this.config.shortcut_key.move_to_parent){
            const parent = this._current_node.parentElement
            if (parent !== null){
                this.modify_highlight(this._current_node,'hover','remove', this.cur_group)
                this.modify_highlight(parent,'hover','add', this.cur_group)
                this._current_node=parent
            }
        }else if (e.key === this.config.shortcut_key.click){

        }
    }

    update_selected_style() {
        for (const group_name of Object.keys(this.config.group)){
            // Make a copy of query result because the result will change when
            // class is modified, which makes the for loop below unstable
            let old_selected = Array.from(this.ifdocument.getElementsByClassName(
                this.get_style_name(group_name, 'select')
                ))
            
            for (var element of old_selected){
                this.modify_highlight(element, 'select', 'remove', group_name)
            }

            this._selected_node[group_name].forEach((e) => {
                this.modify_highlight(e, 'select', 'add', group_name)
            })
        }
    }

}