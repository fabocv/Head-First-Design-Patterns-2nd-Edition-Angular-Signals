# Capítulo 1: Welcome to Design Patterns: intro to Design Patterns

## Introducción

Los autores inician el viaje de aprendizaje mencionando los principios de programación orientada a objetos. Señalan que la idea de este libro es reusar experiencias aprendidas de los patrones en vez de reusar código de manera mecánicamente.

### Problemas al diseñar

Al diseñar una solución, lo más común es generalizar y enfrentarse a casos de clases heredadas que no tienen ciertas funciones o atributos definidos en una clase padre. La herencia no siempre es la mejor solución cuando hay comportamientos que distinguen un elemento heredado de otro.

> ## Principio de diseño:

> Separar lo que cambia de lo que permanece estable, identificando los aspectos comunes del problema y encapsulando las variaciones como implementaciones específicas.

**Ejemplo (Patos)**: algunos vuelan y otros no; unos hacen quack y otros no. Usar solo herencia complica el modelo, porque los comportamientos varían.

**Solución**: definir un contrato con interfaces, que representan unidades de información y acción.

Una interface establece un comportamiento genérico (supertipo).

### Patos, patos y más patos!
Podemos crear dos interfaces: FlyBehavior (que contiene fly() ), QuackBehavior (quack() ).

Una clase como PatosVoladores que implemente FlyBehavior tendrá una función fly() distanta a otra clase como PatosNoVoladores (fly no hace nada.).

Similar a Volar, Graznar implementa QuackBehavior; clase SinGraznido, su metodo quack no hará nada.

La interfaz FlyBehavior puede ser reusada no solo en patos, sino en otros diversas clases que definan aves o animales.

Considerando que las interfaces son supertipos, pueden definir los tipos de mis clases y variables.

```
interface FlyBehavior {
    fly():void;
}

interface QuackBehavior {
    quack():void;
}
```
Delegamos los comportamientos del pato mediante funciones en la clase abstracta 'Pato':
```
class Pato {
    flyBehavior: FlyBehavior,
    quackBehavior: QuackBehavior

    performQuack() {
        quackBehavior.quack()
    }

    performFly() {
        flyBehavior.fly()
    }

    //swim()
    display();
    
}
```

Ahora creamos las clases de comportamientos para definir cada pato
```
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
```

```
class PatosVoladores implements FlyBehavior {
    fly() {
        console.log("Mírame volaar!!");
    }
}

class PatosNoVoladores implements FlyBehavior {
    fly() {
        console.log("No puedo volar :c");
    }
}
```

```
//Flying Steamer-Duck (Chile)
class PatoQuetru extends Pato {
    quackBehavior = new Graznar();
    flyBehavior = new FlyWithWings();

    constructor() {
        this.display();
    }

    display() {
        console.log("Soy un pato Quetru del sur de Chile!);
    }

    performQuack() {
        quackBehavior.quack()
    }

    performFly() {
        flyBehavior.fly()
    }

}
```

Llamando al pato
```
Duck patito = new PatoQuetru(); // Output: Soy un pato Quetru del sur de Chile!
patito.performQuack();          // Output: Quack!
patito.performFly();            // Output: Mírame volaar!!

```

## Y esto es un tipo de patrón?
obvio, pero se verá en detalle más adelante.

![Pato_quetru](https://www.redobservadores.cl/wp-content/uploads/2024/08/Quetru-volador-Benjamin-Gallardo.png)