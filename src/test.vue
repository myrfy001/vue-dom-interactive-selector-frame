<template>
  <div>
    <div id="example-4">
      <input type="radio" id="one" value="group1" v-model="group">
      <label for="group1">One</label>
      <br>
      <input type="radio" id="two" value="group2" v-model="group">
      <label for="group2">Two</label>
      <br>
      <span>Picked: {{ group }}</span>
      <button @click='remove'></button>
    </div>
    <App url="/test.html" v-model='selected' :group='group'> </App>
    {{ selected }}
  </div>
  
</template>

<script>
import App from './App.vue'
export default{
  name: 'Tst',
  components:{
    App
  },
  data() {
    return {
      selected:{},
      group:'group1'
    }
  },
  watch: {
    selected: function(new_val, old_val) {
      console.log({...new_val})
    }
  },
  methods:{
    remove(){
      console.log('rrr')
      this.selected.group1.splice(0,1)
      this.selected = {...this.selected}
    }
  }
}
</script>
