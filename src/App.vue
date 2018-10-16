<template>
  <iframe id="InteractiveDomSelector" :src="url" width= "100%" height= "100%"/>
</template>

<script>

import  { InteractiveSelector } from './injected_code.js'
export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    value: {
      type: Object,
      default: () => {}
    },
    config: {
      type: Object,
      default: () => {}
    },
    group:{
      type: String,
      default: 'group1'
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    const iframe = document.getElementById('InteractiveDomSelector')
    iframe.onload = () => {
      const document_ = iframe.contentDocument
      this._interactive_dom_selector_stub = new InteractiveSelector(document_, this.select_cb, this.config)
      this._interactive_dom_selector_stub.cur_group = this.group
      this._interactive_dom_selector_stub.inject()
      document_._interactive_dom_selector_stub = _interactive_dom_selector_stub
    }
  },
  methods: {
    select_cb() {
      this.$emit('input', {...this._interactive_dom_selector_stub._selected_node})
    }
  },
  watch: { 
    group: function(newVal, oldVal) { // watch it
      this._interactive_dom_selector_stub.cur_group = newVal
    },
    value: function(newVal, oldVal) { // watch it
      this._interactive_dom_selector_stub.selected_node = newVal
    },
  }
}
</script>
