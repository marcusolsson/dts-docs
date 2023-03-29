# Vehicle

## Constructor

```ts
constructor();
```

# Car

Extends `Vehicle`

Implements `Runnable`, `Object`

## Constructor

```ts
constructor(brand: string, regNum: string);
```

## Properties

### regNum

```ts
regNum: string
```

## Methods

### start

```ts
start(): void;
```

### stop

```ts
stop(): void;
```

### on

```ts
on(name: "foo", callback: () => any, ctx?: any): string;
```

### on

```ts
on(name: "bar", callback: () => any, ctx?: any): string;
```

### on

```ts
on(name: "baz", callback: () => any, ctx?: any): string;
```
