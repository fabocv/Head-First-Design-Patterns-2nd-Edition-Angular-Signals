# Capítulo 1: Welcome to Design Patterns: intro to Design Patterns

## Introducción

Los autores inician el viaje de aprendizaje mencionando los principios de programación orientada a objetos. Señalan que la idea de este libro es reusar experiencias aprendidas de los patrones en vez de reusar código de manera mecánicamente.

### Problemas al diseñar

Al diseñar una solución, lo más común es generalizar y enfrentarse a casos de clases heredadas que no tienen ciertas funciones o atributos definidos en una clase padre. La herencia no siempre es la mejor solución cuando hay comportamientos que distinguen un elemento heredado de otro.

> ## Principio de diseño:

> Identificar aspectos en común del problema y separar aquellos que difieren, construyendolos como implementaciones del aspecto común.

Ejemplifican con un modelado de **Patos**. Hay patos que vuelan y otros que no, hay algunos que hacen quack otros no. La herencia se complica en estos casos.

## Separar lo que cambia de lo que permanece igual

Al modelar soluciones, definimos qué conjunto de datos y funciones genéricas tiene un aspecto, definiéndose como un **contrato de datos** que no debe romperse por otra entidad o instancia. Para ello empleamos **INTERFACES** como una unidad básica de información y acción que define un contrato y un comportamiento de un aspecto de solución.

### Programar una interface es programar un supertipo

La interface define un comportamiento. Las clases que necesiten tener esta característica, deben implementarle, tipando su clase y obligando a definir las funciones que éste exija (polimorfismo).

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
class Quack implements QuackBehavior {
    quack() {
        console.log("Quack");
    }
}

class MuteQuack implements QuackBehavior {
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

class FlyNoWay implements FlyBehavior {
    fly() {
        console.log("No puedo volar :c");
    }
}
```

```
//Flying Steamer-Duck (Chile)
class PatoQuetru extends Pato {
    quackBehavior = new Quack();
    flyBehavior = new FlyWithWings();

    constructor() {
        this.display();
    }

    display() {
        console.log("Soy un pato Quetru del sur de Chile!);
    }
}
```

Llamando al pato
```
Duck patito = new PatoQuetru(); // Output: Soy un pato Quetru del sur de Chile!
patito.performQuack();          // Output: Quack!
patito.performFly();            // Output: Mírame volaar!!

```

![Pato_quetru](https://www.redobservadores.cl/wp-content/uploads/2024/08/Quetru-volador-Benjamin-Gallardo.png)