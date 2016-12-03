new Vue({
  el: "#todo",

  data: {
    newTask: "",
    taskList: []
  },

  methods: {
    addTask: function(){
      var task = this.newTask.trim();

      if (task){
        this.taskList.push({
          text: task,
          checked: false
        });
        this.newTask = "";
      }
    },
    removeTask: function(task){
      var index = this.taskList.indexOf(task)
      this.taskList.splice(index,1)
    },
    clearList: function(){
      this.taskList = []
    },
    selectAll: function(task){
      var trueOrFalse = this.areAllSelected ? false : true

      for( var i = 0; i < this.taskList.length; i++){
        this.taskList[i].checked = trueOrFalse
      }
    }
  },

  computed: {
    areAllSelected: function(){
      return this.taskList.every(function(task){
        return task.checked
      }) && this.taskList.length > 0
    }
  }

});