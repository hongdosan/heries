// Class name composition helper.
// shadcn/ui · clsx / classnames 등 프론트엔드 표준 패턴의 *런타임 의존 0* 자체 구현.
// 조건부 class / falsy filter / array spread 모두 처리.
//
// Usage:
//   <button className={cn('bg-accent', isActive && 'opacity-100', disabled && 'opacity-50')} />
//   <div className={cn(baseClasses, variants[variant], className)} />
//
// React Compiler `compilationMode: 'infer'` 정합 — 본 utility 는 plain function (컴파일 X).

export function cn(...classes: ReadonlyArray<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
