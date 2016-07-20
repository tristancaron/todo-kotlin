/**
 * More information about [data class] (https://kotlinlang.org/docs/reference/data-classes.html)
 *
 * In our application, it will make easier the JSON serialization.
 */
data class TodoModel(var text: String, var completed: Boolean)