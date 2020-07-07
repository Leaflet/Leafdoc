// Adapted from https://en.wikibooks.org/wiki/Computer_Science_Design_Patterns/Singleton

/**
 * 🍂class SingletonObject
 * Generic implementation of a singleton
 */
class SingletonObject {
	// 🍂section Private
	// 🍂property SingletonObject: object; The insternal instance of the object.
	private static SingletonObject object;

	// 🍂method SingletonObject(): null; Instantiates the object, only called once.
	private SingletonObject() {
		// Instantiate the object.
	}

	// 🍂section Public
	// 🍂method getInstance(): SingletonObject; Returns the singleton instance.
	public static SingletonObject getInstance() {
		if (object == null) {
			object = new SingletonObject(); // Create the object for the first and last time
		}
		return object;
	}
}
