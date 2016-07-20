(function (Kotlin) {
  'use strict';
  var _ = Kotlin.defineRootPackage(null, /** @lends _ */ {
    TodoAppComponent: Kotlin.createClass(null, function () {
      var tmp$0;
      this.todoItemComponents_u1hrb9$ = Kotlin.modules['stdlib'].kotlin.collections.mutableListOf_9mqe4v$([]);
      this.todoListElement_ci3dn0$ = this.q_61zpoe$('.todo-list');
      this.mainElement_fznlvt$ = this.q_61zpoe$('.main');
      this.checkAllCheckboxElement_jfu0lo$ = Kotlin.isType(tmp$0 = this.q_61zpoe$('.toggle-all'), HTMLInputElement) ? tmp$0 : Kotlin.throwCCE();
      this.footerElement_8rdavp$ = this.q_61zpoe$('.footer');
      this.countElement_qfea61$ = this.q_61zpoe$('.todo-count');
      this.clearCompletedElement_ro0jji$ = this.q_61zpoe$('.clear-completed');
      this.showAllElement_zhtblw$ = this.q_61zpoe$(".filters a[href='#/']");
      this.showActiveElement_bn66j1$ = this.q_61zpoe$(".filters a[href='#/active']");
      this.showCompletedElement_pccxpi$ = this.q_61zpoe$(".filters a[href='#/completed']");
      this.initLocalStorage();
      this.initElementEventListeners();
      this.updateDisplay();
    }, /** @lends _.TodoAppComponent.prototype */ {
      q_61zpoe$: function (selector) {
        var tmp$0;
        return (tmp$0 = document.querySelector(selector)) != null ? tmp$0 : Kotlin.throwNPE();
      },
      initLocalStorage: function () {
        var tmp$0;
        var tmp$1;
        if ((tmp$0 = window.localStorage['todo-kotlin']) != null) {
          var block$result;
          var list = JSON.parse(tmp$0);
          var tmp$4, tmp$3, tmp$2;
          tmp$4 = list, tmp$3 = tmp$4.length;
          for (var tmp$2 = 0; tmp$2 !== tmp$3; ++tmp$2) {
            var element = tmp$4[tmp$2];
            this.addTodo(element);
          }
          tmp$1 = block$result;
        }
         else
          tmp$1 = null;
        tmp$1;
      },
      initElementEventListeners: function () {
        var tmp$0;
        var newTodoElement = Kotlin.isType(tmp$0 = document.querySelector('.new-todo'), HTMLInputElement) ? tmp$0 : Kotlin.throwCCE();
        Kotlin.modules['stdlib'].kotlin.dom.on_9k7t35$(newTodoElement, 'keydown', false, _.TodoAppComponent.initElementEventListeners$f(newTodoElement, this));
        Kotlin.modules['stdlib'].kotlin.dom.on_9k7t35$(this.checkAllCheckboxElement_jfu0lo$, 'click', false, _.TodoAppComponent.initElementEventListeners$f_0(this));
        Kotlin.modules['stdlib'].kotlin.dom.on_9k7t35$(this.clearCompletedElement_ro0jji$, 'click', false, _.TodoAppComponent.initElementEventListeners$f_1(this));
        window.addEventListener('hashchange', _.TodoAppComponent.initElementEventListeners$f_2(this));
      },
      addTodo: function (todoModel) {
        var component = new _.TodoItemComponent(this, todoModel);
        this.todoItemComponents_u1hrb9$.add_za3rmp$(component);
        this.todoListElement_ci3dn0$.appendChild(component.elementRef);
      },
      updateDisplay: function () {
        var display = this.todoItemComponents_u1hrb9$.isEmpty() ? 'none' : 'block';
        this.mainElement_fznlvt$.style.display = display;
        this.footerElement_8rdavp$.style.display = display;
        this.updateCounts();
      },
      updateCounts: function () {
        var tmp$2;
        var count = 0;
        tmp$2 = this.todoItemComponents_u1hrb9$.iterator();
        while (tmp$2.hasNext()) {
          var element = tmp$2.next();
          if (element.isCompleted) {
            count++;
          }
        }
        var complete = count;
        this.checkAllCheckboxElement_jfu0lo$.checked = complete === this.todoItemComponents_u1hrb9$.size;
        var left = this.todoItemComponents_u1hrb9$.size - complete;
        this.countElement_qfea61$.innerHTML = '<strong>' + left + '<\/strong> item' + (left !== 1 ? 's' : '') + ' left';
        this.clearCompletedElement_ro0jji$.style.display = complete === 0 ? 'none' : 'block';
        this.updateFilter();
      },
      updateFilter: function () {
        var tmp$0, tmp$1;
        tmp$0 = window.location.hash;
        if (Kotlin.equals(tmp$0, '#/active'))
          tmp$1 = this.showActiveElement_bn66j1$;
        else if (Kotlin.equals(tmp$0, '#/completed'))
          tmp$1 = this.showCompletedElement_pccxpi$;
        else
          tmp$1 = this.showAllElement_zhtblw$;
        this.show(tmp$1);
      },
      show: function (selectedElement) {
        this.setSelectedFilter(selectedElement);
        if (Kotlin.equals(selectedElement, this.showAllElement_zhtblw$)) {
          var tmp$0;
          tmp$0 = this.todoItemComponents_u1hrb9$.iterator();
          while (tmp$0.hasNext()) {
            var element = tmp$0.next();
            element.isVisible_6taknv$(true);
          }
        }
         else if (Kotlin.equals(selectedElement, this.showActiveElement_bn66j1$)) {
          var tmp$1;
          tmp$1 = this.todoItemComponents_u1hrb9$.iterator();
          while (tmp$1.hasNext()) {
            var element_0 = tmp$1.next();
            element_0.isVisible_6taknv$(!element_0.isCompleted);
          }
        }
         else if (Kotlin.equals(selectedElement, this.showCompletedElement_pccxpi$)) {
          var tmp$2;
          tmp$2 = this.todoItemComponents_u1hrb9$.iterator();
          while (tmp$2.hasNext()) {
            var element_1 = tmp$2.next();
            element_1.isVisible_6taknv$(element_1.isCompleted);
          }
        }
      },
      setSelectedFilter: function (selectedElement) {
        this.showAllElement_zhtblw$.classList.remove('selected');
        this.showActiveElement_bn66j1$.classList.remove('selected');
        this.showCompletedElement_pccxpi$.classList.remove('selected');
        selectedElement.classList.add('selected');
      },
      save: function () {
        var $receiver = this.todoItemComponents_u1hrb9$;
        var destination = new Kotlin.ArrayList(Kotlin.modules['stdlib'].kotlin.collections.collectionSizeOrDefault($receiver, 10));
        var tmp$0;
        tmp$0 = $receiver.iterator();
        while (tmp$0.hasNext()) {
          var item = tmp$0.next();
          destination.add_za3rmp$(item.todoModel);
        }
        var list = destination;
        window.localStorage['todo-kotlin'] = JSON.stringify(list);
      },
      remove_l0xifw$: function (todoItemComponent) {
        this.todoItemComponents_u1hrb9$.remove_za3rmp$(todoItemComponent);
        this.updateDisplay();
        this.save();
      }
    }, /** @lends _.TodoAppComponent */ {
      initElementEventListeners$f: function (closure$newTodoElement, this$TodoAppComponent) {
        return function (it) {
          var tmp$0;
          var closure$newTodoElement_0 = closure$newTodoElement;
          var this$TodoAppComponent_0 = this$TodoAppComponent;
          if ((Kotlin.isType(tmp$0 = it, KeyboardEvent) ? tmp$0 : Kotlin.throwCCE()).keyCode === 13) {
            var $receiver = closure$newTodoElement_0.value;
            var tmp$1;
            var text = Kotlin.modules['stdlib'].kotlin.text.trim_gw00vq$($receiver).toString();
            if (!Kotlin.modules['stdlib'].kotlin.text.isBlank_gw00vq$(text)) {
              this$TodoAppComponent_0.addTodo(new _.TodoModel(text, false));
              closure$newTodoElement_0.value = '';
              this$TodoAppComponent_0.updateDisplay();
              this$TodoAppComponent_0.save();
            }
          }
        };
      },
      initElementEventListeners$f_0: function (this$TodoAppComponent) {
        return function (it) {
          var $receiver = this$TodoAppComponent.todoItemComponents_u1hrb9$;
          var destination = new Kotlin.ArrayList();
          var tmp$1;
          tmp$1 = $receiver.iterator();
          while (tmp$1.hasNext()) {
            var element = tmp$1.next();
            var this$TodoAppComponent_0 = this$TodoAppComponent;
            if (!Kotlin.equals(element.isCompleted, this$TodoAppComponent_0.checkAllCheckboxElement_jfu0lo$.checked)) {
              destination.add_za3rmp$(element);
            }
          }
          var tmp$2;
          tmp$2 = destination.iterator();
          while (tmp$2.hasNext()) {
            var element_0 = tmp$2.next();
            element_0.isCompleted = !element_0.isCompleted;
          }
          this$TodoAppComponent.updateCounts();
          this$TodoAppComponent.save();
        };
      },
      initElementEventListeners$f_1: function (this$TodoAppComponent) {
        return function (it) {
          var $receiver = this$TodoAppComponent.todoItemComponents_u1hrb9$;
          var destination = new Kotlin.ArrayList();
          var tmp$1;
          tmp$1 = $receiver.iterator();
          while (tmp$1.hasNext()) {
            var element = tmp$1.next();
            if (element.isCompleted) {
              destination.add_za3rmp$(element);
            }
          }
          var tmp$2;
          tmp$2 = destination.iterator();
          while (tmp$2.hasNext()) {
            var element_0 = tmp$2.next();
            element_0.remove();
          }
          this$TodoAppComponent.updateDisplay();
          this$TodoAppComponent.save();
        };
      },
      initElementEventListeners$f_2: function (this$TodoAppComponent) {
        return function (event) {
          this$TodoAppComponent.updateFilter();
        };
      }
    }),
    TodoItemComponent: Kotlin.createClass(null, function (todoAppComponent, todoModel) {
      var tmp$0, tmp$1, tmp$2, tmp$3;
      this.todoAppComponent = todoAppComponent;
      this.todoModel = todoModel;
      this.view = "\n            <div class='view'>\n                <input class='toggle' type='checkbox'>\n                <label class='todo-content'><\/label>\n                <button class='destroy'><\/button>\n            <\/div>\n            <input class='edit'>\n    ";
      this.elementRef = Kotlin.modules['stdlib'].kotlin.dom.build.createElement_juqb3g$(document, 'li', _.TodoItemComponent.TodoItemComponent$f(this));
      this.checkbox = Kotlin.isType(tmp$0 = this.elementRef.querySelector("[type='checkbox']"), HTMLInputElement) ? tmp$0 : Kotlin.throwCCE();
      this.edit = Kotlin.isType(tmp$1 = this.elementRef.querySelector('.edit'), HTMLInputElement) ? tmp$1 : Kotlin.throwCCE();
      this.label = Kotlin.isType(tmp$2 = this.elementRef.querySelector('label'), HTMLLabelElement) ? tmp$2 : Kotlin.throwCCE();
      this.button = Kotlin.isType(tmp$3 = this.elementRef.querySelector('button'), HTMLButtonElement) ? tmp$3 : Kotlin.throwCCE();
      this.initEventListener();
      this.bindValues();
    }, /** @lends _.TodoItemComponent.prototype */ {
      isCompleted: {
        get: function () {
          return this.todoModel.completed;
        },
        set: function (value) {
          this.checkbox.checked = value;
          this.elementRef.classList.toggle('completed');
          this.todoModel.completed = value;
        }
      },
      bindValues: function () {
        if (this.todoModel.completed) {
          this.elementRef.classList.add('completed');
          this.checkbox.checked = true;
        }
        this.label.textContent = this.todoModel.text;
        this.edit.value = this.todoModel.text;
      },
      initEventListener: function () {
        Kotlin.modules['stdlib'].kotlin.dom.onClick_g2lu80$(this.checkbox, void 0, _.TodoItemComponent.initEventListener$f(this));
        Kotlin.modules['stdlib'].kotlin.dom.onDoubleClick_g2lu80$(this.label, void 0, _.TodoItemComponent.initEventListener$f_0(this));
        Kotlin.modules['stdlib'].kotlin.dom.onClick_g2lu80$(this.button, void 0, _.TodoItemComponent.initEventListener$f_1(this));
        var $this = this.edit;
        Kotlin.modules['stdlib'].kotlin.dom.on_9k7t35$($this, 'keydown', false, _.TodoItemComponent.f(this, $this));
        Kotlin.modules['stdlib'].kotlin.dom.on_9k7t35$($this, 'blur', false, _.TodoItemComponent.f_0(this));
      },
      remove: function () {
        this.elementRef.remove();
        this.todoAppComponent.remove_l0xifw$(this);
      },
      endEditing: function () {
        var $this = this.edit;
        var $receiver = $this.value;
        var tmp$1;
        $this.value = Kotlin.modules['stdlib'].kotlin.text.trim_gw00vq$($receiver).toString();
        var $receiver_0 = $this.value;
        if (!Kotlin.modules['stdlib'].kotlin.text.isBlank_gw00vq$($receiver_0)) {
          this.todoModel.text = $this.value;
          this.label.textContent = $this.value;
          this.elementRef.classList.remove('editing');
        }
         else {
          $this.remove();
        }
      },
      isVisible_6taknv$: function (visible) {
        this.elementRef.style.display = visible ? 'block' : 'none';
      }
    }, /** @lends _.TodoItemComponent */ {
      initEventListener$f: function (this$TodoItemComponent) {
        return function (it) {
          this$TodoItemComponent.isCompleted = this$TodoItemComponent.checkbox.checked;
          this$TodoItemComponent.todoAppComponent.updateCounts();
          this$TodoItemComponent.todoAppComponent.save();
        };
      },
      initEventListener$f_0: function (this$TodoItemComponent) {
        return function (it) {
          this$TodoItemComponent.elementRef.classList.add('editing');
          this$TodoItemComponent.edit.selectionStart = this$TodoItemComponent.todoModel.text.length;
          this$TodoItemComponent.edit.focus();
        };
      },
      initEventListener$f_1: function (this$TodoItemComponent) {
        return function (it) {
          this$TodoItemComponent.remove();
        };
      },
      f: function (this$TodoItemComponent, this$) {
        return function (it) {
          var tmp$0;
          var keyEvent = Kotlin.isType(tmp$0 = it, KeyboardEvent) ? tmp$0 : Kotlin.throwCCE();
          if (keyEvent.keyCode === 13) {
            this$TodoItemComponent.endEditing();
          }
           else if (keyEvent.keyCode === 27) {
            this$TodoItemComponent.elementRef.classList.remove('editing');
            this$.value = this$TodoItemComponent.todoModel.text;
          }
        };
      },
      f_0: function (this$TodoItemComponent) {
        return function (it) {
          this$TodoItemComponent.endEditing();
        };
      },
      TodoItemComponent$f: function (this$TodoItemComponent) {
        return function () {
          this.innerHTML = this$TodoItemComponent.view;
        };
      }
    }),
    main_kand9s$: function (args) {
      return new _.TodoAppComponent();
    },
    TodoModel: Kotlin.createClass(null, function (text, completed) {
      this.text = text;
      this.completed = completed;
    }, /** @lends _.TodoModel.prototype */ {
      component1: function () {
        return this.text;
      },
      component2: function () {
        return this.completed;
      },
      copy_ivxn3r$: function (text, completed) {
        return new _.TodoModel(text === void 0 ? this.text : text, completed === void 0 ? this.completed : completed);
      },
      toString: function () {
        return 'TodoModel(text=' + Kotlin.toString(this.text) + (', completed=' + Kotlin.toString(this.completed)) + ')';
      },
      hashCode: function () {
        var result = 0;
        result = result * 31 + Kotlin.hashCode(this.text) | 0;
        result = result * 31 + Kotlin.hashCode(this.completed) | 0;
        return result;
      },
      equals_za3rmp$: function (other) {
        return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.text, other.text) && Kotlin.equals(this.completed, other.completed)))));
      }
    })
  });
  Kotlin.defineModule('todo', _);
  _.main_kand9s$([]);
}(Kotlin));

//@ sourceMappingURL=todo.js.map
