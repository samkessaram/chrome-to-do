var data = {
    todo: "",
    todos: [],
  }

var vm = new Vue({
  el: "#todo",

  data: data,

  methods: {
    addTask: function(){
      var task = this.todo.trim();

      if (task){
        todoDB.indexedDB.addTodo(task, false)
        this.todo = "";
      }
    },
    editTask: function(task){
      editTodo(task);
    },
    checkTask: function(task){
      checkTodo(task);
    },
    removeTask: function(task){
      deleteTodo(task.key);
    },
    clearList: function(){
      var confirm = window.confirm('Are you sure you want to delete all tasks?')
      if ( confirm === true ){
        deleteAllTodos();
      }
    },
    selectAll: function(){
      checkAllTodos(this);
    }
  },

  computed: {
    classObject: function(){
      return {
        'fa-square': !areAllSelected(this),
        'fa-check-square': areAllSelected(this)
      }
    }
  }

});

function areAllSelected(thisVue){
  return thisVue.todos.every(function(task){
    return task.checked
  }) && thisVue.todos.length > 0
}