
export class InteractiveSelector {


    constructor(ifdocument){
        this.ifdocument = ifdocument
        this.selected_node = []
        this.inject_style()

        ifdocument.addEventListener('mouseover', this.mouseover_handler.bind(this), { capture: true })
        ifdocument.addEventListener('mouseout', this.mouseout_handler.bind(this), { capture: true })
        ifdocument.addEventListener('click', this.mouseclick_handler.bind(this), { capture: true })
    }


    inject_style() {
        var n = this.ifdocument.createElement('style')
        n.innerHTML = `
        .-interactive-dom-selector-injected-style-highlight-selected{outline:2px solid red!important; background-color:#ff00000a!important}
        .-interactive-dom-selector-injected-style-highlight-mouse-hover{outline:2px solid green!important}
        `
        this.ifdocument.body.appendChild(n)
    }

    modify_highlight(node, typ, action) {
        var style_to_modify;
        if (typ === 'hover') {
            style_to_modify = '-interactive-dom-selector-injected-style-highlight-mouse-hover'
        }else if (typ === 'select'){
            style_to_modify = '-interactive-dom-selector-injected-style-highlight-selected'
        }

        if (action === 'add') {
            node.classList.add(style_to_modify)
        } else if (action === 'remove'){
            node.classList.remove(style_to_modify)
        }

    }

    mouseover_handler(e) {
        this.modify_highlight(e.target,'hover','add')
    }
    mouseout_handler(e) {
        this.modify_highlight(e.target,'hover','remove')
    }

    mouseclick_handler(e) {
        const node = e.target
        const selected_idx = this.selected_node.indexOf(node)
        if ( selected_idx === -1){
            this.selected_node.push(node)
        }else{
            this.selected_node.splice(selected_idx, 1)
        }
        this.update_selected()
    }

    update_selected() {
        // Make a copy of query result because the result will change when
        // class is modified, which makes the for loop below unstable
        const old_selected = Array.from(this.ifdocument.getElementsByClassName(
            '-interactive-dom-selector-injected-style-highlight-selected'
            ))
        
        for (var element of old_selected){
            console.log(old_selected)
            this.modify_highlight(element, 'select', 'remove')
            console.log(old_selected)
        }

        this.selected_node.forEach((e) => {
            this.modify_highlight(e, 'select', 'add')
        })
    }

}