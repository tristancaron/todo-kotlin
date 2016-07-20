import org.w3c.dom.Element
import org.w3c.dom.HTMLButtonElement
import org.w3c.dom.HTMLInputElement
import org.w3c.dom.HTMLLabelElement
import org.w3c.dom.events.KeyboardEvent
import kotlin.browser.document
import kotlin.dom.build.createElement
import kotlin.dom.on
import kotlin.dom.onClick
import kotlin.dom.onDoubleClick

class TodoItemComponent(val todoAppComponent: TodoAppComponent, val todoModel: TodoModel) {
    val elementRef: Element

    val checkbox: HTMLInputElement
    val edit: HTMLInputElement
    val label: HTMLLabelElement
    val button: HTMLButtonElement

    val view = """
            <div class='view'>
                <input class='toggle' type='checkbox'>
                <label class='todo-content'></label>
                <button class='destroy'></button>
            </div>
            <input class='edit'>
    """

    init {
        elementRef = document.createElement("li") {
            innerHTML = view
        }

        checkbox = elementRef.querySelector("[type='checkbox']") as HTMLInputElement
        edit = elementRef.querySelector(".edit") as HTMLInputElement
        label = elementRef.querySelector("label") as HTMLLabelElement
        button = elementRef.querySelector("button") as HTMLButtonElement

        initEventListener()
        bindValues()
    }

    private fun bindValues() {
        if (todoModel.completed) {
            elementRef.classList.add("completed")
            checkbox.checked = true
        }

        label.textContent = todoModel.text
        edit.value = todoModel.text
    }

    var isCompleted: Boolean
        set(value) {
            checkbox.checked = value
            elementRef.classList.toggle("completed")

            todoModel.completed = value
        }
        get() = todoModel.completed

    private fun initEventListener() {
        checkbox.onClick {
            isCompleted = checkbox.checked

            todoAppComponent.updateCounts()
            todoAppComponent.save()
        }

        label.onDoubleClick {
            elementRef.classList.add("editing")
            edit.selectionStart = todoModel.text.count()
            edit.focus()
        }

        button.onClick { remove() }

        edit.run {
            on("keydown", false) {
                val keyEvent = it as KeyboardEvent

                if (keyEvent.keyCode == 13) {
                    endEditing()
                } else if (keyEvent.keyCode == 27) {
                    elementRef.classList.remove("editing")
                    value = todoModel.text
                }
            }

            on("blur", false) { endEditing() }
        }
    }

    fun remove() {
        elementRef.remove()
        todoAppComponent.remove(this)
    }

    private fun endEditing() {
        with (edit) {
            value = value.trim()

            if (value.isNotBlank()) {
                todoModel.text = value
                label.textContent = value
                elementRef.classList.remove("editing")
            } else {
                remove()
            }
        }
    }

    fun isVisible(visible: Boolean) {
        elementRef.asDynamic().style.display = if (visible) "block" else "none"
    }
}