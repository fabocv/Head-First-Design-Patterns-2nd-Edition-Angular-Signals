
// --- Interfaces ---
interface FlyBehavior {
  fly(): void;
}

interface QuackBehavior {
  quack(): void;
}

// --- Comportamientos concretos ---
class Graznar implements QuackBehavior {
  quack() {
    console.log("Quack");
  }
}

class SinGraznido implements QuackBehavior {
  quack() {
    console.log("-");
  }
}

class Squeak implements QuackBehavior {
  quack() {
    console.log("Squeak");
  }
}

class VuelanConAlas implements FlyBehavior {
  fly() {
    console.log("Mírame volaar!!");
  }
}

class NoVuelan implements FlyBehavior {
  fly() {
    console.log("No puedo volar :c");
  }
}

// Nueva clase voladora (cohetes)
class FlyRocketPowered implements FlyBehavior {
  fly() {
    console.log("Estoy volando con cohetes!!");
  }
}

// --- Clase base Pato (abstracta) ---
abstract class Pato {
  // protected para que subclases puedan acceder si lo necesitan
  protected flyBehavior: FlyBehavior;
  protected quackBehavior: QuackBehavior;

  constructor(flyBehavior: FlyBehavior, quackBehavior: QuackBehavior) {
    this.flyBehavior = flyBehavior;
    this.quackBehavior = quackBehavior;
  }

  performQuack() {
    this.quackBehavior.quack();
  }

  performFly() {
    this.flyBehavior.fly();
  }

  // comportamiento común
  swim() {
    console.log("Estoy nadando 🏊‍♂️");
  }

  // cada subclase debe definir cómo se muestra
  abstract display(): void;

  // permite cambiar comportamientos en runtime
  setFlyBehavior(fb: FlyBehavior) {
    this.flyBehavior = fb;
  }

  setQuackBehavior(qb: QuackBehavior) {
    this.quackBehavior = qb;
  }
}

// --- Implementación concreta ---
class PatoQuetru extends Pato {
  constructor() {
    // define comportamientos por defecto y pasa al super
    super(new VuelanConAlas(), new Graznar());
    // opcional: mostrar al instanciar
    this.display();
  }

  display() {
    console.log('Soy un pato Quetru del sur de Chile!');
  }

  // no es necesario sobreescribir performFly/performQuack salvo que quieras cambiar comportamiento
}

// --- Uso / demo ---
const patito: Pato = new PatoQuetru(); // muestra mensaje en constructor
patito.performQuack();                 // "Quack"
patito.performFly();                   // "Mírame volaar!!"

// Intercambiamos comportamiento en tiempo de ejecución
patito.setFlyBehavior(new FlyRocketPowered());
patito.performFly();                   // "Estoy volando con cohetes!!"
