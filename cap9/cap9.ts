// composite-iterator.ts

// ----------------- Composite -----------------

/** Componente base del composite */
abstract class OrgComponent {
  constructor(public readonly name: string) {}
  // operaciones comunes
  abstract describe(indent?: string): string;

  // Operaciones de composite (por defecto: no aplican en leaf)
  add(_c: OrgComponent): void {
    throw new Error('Not supported');
  }
  remove(_c: OrgComponent): void {
    throw new Error('Not supported');
  }
  summary(): string {
    return `${this.name}`;
  }
  getChildren(): OrgComponent[] {
    return [];
  }
}

/** Hoja: Employee */
class Employee extends OrgComponent {
  constructor(name: string, public readonly role: string) { super(name); }
  describe(indent = ''): string { return `${indent}- Employee: ${this.name} (${this.role})`; }
  summary(): string { return `- Employee: ${this.name} (${this.role})`; }
}

/** Composite: Department */
class Department extends OrgComponent {
  private children: OrgComponent[] = [];

  constructor(name: string) {
    super(name);
  }

  add(c: OrgComponent): void {
    this.children.push(c);
  }

  remove(c: OrgComponent): void {
    this.children = this.children.filter(ch => ch !== c);
  }

  getChildren(): OrgComponent[] {
    // devolvemos copia para evitar manipulación externa directa
    return [...this.children];
  }

  describe(indent = ''): string {
    const lines = [`${indent}+ Department: ${this.name}`];
    for (const ch of this.children) lines.push(ch.describe(indent + '  '));
    return lines.join('\n');
  }
  summary(): string { return `+ Department: ${this.name}`; }
}

// ----------------- Iterator -----------------

type Traversal = 'preorder' | 'breadth-first';

/**
 * TreeIterator: iterable que recorre un OrgComponent en preorder o breadth-first.
 * Implementa Iterable<OrgComponent> para permitir: for (const node of new TreeIterator(root, 'preorder')) { ... }
 */
class TreeIterator implements Iterable<OrgComponent>, Iterator<OrgComponent> {
  private queue: OrgComponent[] = [];
  private stack: OrgComponent[] = [];
  private nextItem: OrgComponent | null = null;

  constructor(private root: OrgComponent, private traversal: Traversal = 'preorder') {
    if (traversal === 'preorder') {
      // stack-based DFS (preorder)
      this.stack = [root];
    } else {
      // queue-based BFS
      this.queue = [root];
    }
  }

  // Iterator protocol
  public next(): IteratorResult<OrgComponent> {
    if (this.traversal === 'preorder') {
      if (this.stack.length === 0) return { done: true, value: undefined as any };
      const node = this.stack.pop()!;
      const children = node.getChildren();
      // push children en orden inverso usando slice().reverse()
      for (const child of children.slice().reverse()) {
        this.stack.push(child);
      }
      return { done: false, value: node };
    } else {
      if (this.queue.length === 0) return { done: true, value: undefined as any };
      const node = this.queue.shift()!;
      for (const ch of node.getChildren()) this.queue.push(ch);
      return { done: false, value: node };
    }
  }

  // Iterable protocol: devuelve un iterator nuevo para soportar múltiples for-of independientes
  [Symbol.iterator](): Iterator<OrgComponent> {
    // construimos un nuevo iterator con el mismo tipo de recorrido
    return new TreeIterator(this.root, this.traversal);
  }
}

// ----------------- Demo / Uso -----------------

function buildSampleOrg(): Department {
  const company = new Department('Acme Corp');

  const eng = new Department('Engineering');
  eng.add(new Employee('Alice', 'Senior Engineer'));
  eng.add(new Employee('Bob', 'Engineer'));

  const backend = new Department('Backend Team');
  backend.add(new Employee('Carol', 'Backend Engineer'));
  backend.add(new Employee('Dan', 'Backend Engineer'));

  const frontend = new Department('Frontend Team');
  frontend.add(new Employee('Eve', 'Frontend Engineer'));

  eng.add(backend);
  eng.add(frontend);

  const hr = new Department('HR');
  hr.add(new Employee('Heidi', 'HR Manager'));

  company.add(eng);
  company.add(hr);
  company.add(new Employee('Ivan', 'CEO'));

  return company;
}

function demo() {
  const org = buildSampleOrg();

  console.log('--- Org structure (describe) ---');
  console.log(org.describe());

  console.log('\n--- Preorder traversal (DFS) ---');
  for (const node of new TreeIterator(org, 'preorder')) {
    console.log('  ' + node.summary());
  }
  
  console.log('\n--- Breadth-first traversal (BFS) ---');
  for (const node of new TreeIterator(org, 'breadth-first')) {
    console.log('  ' + node.summary());
  }
}

demo();
