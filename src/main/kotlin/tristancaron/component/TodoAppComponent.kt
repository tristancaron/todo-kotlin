import org.w3c.dom.Element
import org.w3c.dom.HTMLInputElement
import org.w3c.dom.events.KeyboardEvent
import kotlin.browser.document
import kotlin.browser.window
import kotlin.dom.on

class TodoAppComponent {
    private val todoItemComponents: MutableList<TodoItemComponent> = mutableListOf()

    private val todoListElement: Element = q(".todo-list")
    private val mainElement: Element = q(".main")
    private val checkAllCheckboxElement: HTMLInputElement = q(".toggle-all") as HTMLInputElement
    private val footerElement: Element = q(".footer")
    private val countElement: Element = q(".todo-count")
    private val clearCompletedElement: Element = q(".clear-completed")

    private val showAllElement: Element = q(".filters a[href='#/']")
    private val showActiveElement: Element = q(".filters a[href='#/active']")
    private val showCompletedElement: Element = q(".filters a[href='#/completed']")

    fun q(selector: String) = document.querySelector(selector)!!

    init {
        initLocalStorage()
        initElementEventListeners()

        updateDisplay()
    }

    private fun initLocalStorage() {
        window.localStorage["todo-kotlin"]?.let { todos ->
            val list = JSON.parse<Array<TodoModel>>(todos)

            list.forEach { addTodo(it) }
        }
    }

    private fun initElementEventListeners() {
        val newTodoElement = document.querySelector(".new-todo") as HTMLInputElement

        newTodoElement.on("keydown", false) {
            with(it as KeyboardEvent) {
                if (keyCode == 13) {
                    val text = newTodoElement.value.trim()

                    if (text.isNotBlank()) {
                        addTodo(TodoModel(text, false))
                        newTodoElement.value = ""

                        updateDisplay()
                        save()
                    }
                }
            }
        }

        checkAllCheckboxElement.on("click", false) {
            todoItemComponents
                    .filter { it.isCompleted != checkAllCheckboxElement.checked }
                    .forEach { it.isCompleted = !it.isCompleted }

            updateCounts()
            save()
        }

        clearCompletedElement.on("click", false) {
            todoItemComponents
                    .filter { it.isCompleted }
                    .forEach { it.remove() }

            updateDisplay()
            save()
        }

        window.addEventListener("hashchange", fun(@Suppress("UNUSED_PARAMETER") event) {
            updateFilter()
        })
    }

    private fun addTodo(todoModel: TodoModel) {
        val component = TodoItemComponent(this, todoModel)

        todoItemComponents.add(component)
        todoListElement.appendChild(component.elementRef)
    }

    private fun updateDisplay() {
        val display = if (todoItemComponents.isEmpty()) "none" else "block"

        mainElement.asDynamic().style.display = display
        footerElement.asDynamic().style.display = display

        updateCounts()
    }

    fun updateCounts() {
        val complete = todoItemComponents.count { it.isCompleted }

        checkAllCheckboxElement.checked = (complete == todoItemComponents.count())

        val left = todoItemComponents.count() - complete
        countElement.innerHTML = "<strong>$left</strong> item${if (left != 1) "s" else ""} left"

        clearCompletedElement.asDynamic().style.display = if (complete == 0) "none" else "block"

        updateFilter()
    }

    private fun updateFilter() {
        show(when (window.location.hash) {
            "#/active" -> showActiveElement
            "#/completed" -> showCompletedElement
            else -> showAllElement
        })
    }

    private fun show(selectedElement: Element) {
        setSelectedFilter(selectedElement)

        when (selectedElement) {
            showAllElement ->
                todoItemComponents.forEach { it.isVisible(true) }
            showActiveElement ->
                todoItemComponents.forEach { it.isVisible(!it.isCompleted) }
            showCompletedElement ->
                todoItemComponents.forEach { it.isVisible(it.isCompleted) }
        }
    }

    private fun setSelectedFilter(selectedElement: Element) {
        showAllElement.classList.remove("selected")
        showActiveElement.classList.remove("selected")
        showCompletedElement.classList.remove("selected")
        selectedElement.classList.add("selected")
    }

    fun save() {
        val list = todoItemComponents.map { it.todoModel }

        window.localStorage["todo-kotlin"] = JSON.stringify(list)
    }

    fun  remove(todoItemComponent: TodoItemComponent) {
        todoItemComponents.remove(todoItemComponent)
        updateDisplay()
        save()
    }
}