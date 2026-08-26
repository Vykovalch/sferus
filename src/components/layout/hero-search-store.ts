/**
 * Внешний стор для видимости Hero-инпута поиска.
 *
 * `Header` и `HeroSection` — не связанные пропсами поддеревья (первый живёт
 * в layout, второй — на странице), а IntersectionObserver наблюдает за
 * инпутом внутри Hero. Обычный проп тут не пробросить, контекст ради одного
 * булева значения — избыточен, поэтому используется модульный store по
 * паттерну `useSyncExternalStore` (см. https://react.dev/reference/react/useSyncExternalStore).
 *
 * Мутируется только на клиенте, из эффекта в `SearchBar` после гидратации.
 */

type Listener = () => void;

let heroIntersecting = true;
const listeners = new Set<Listener>();

export function setHeroIntersecting(value: boolean) {
  if (heroIntersecting === value) return;
  heroIntersecting = value;
  for (const listener of listeners) listener();
}

export function subscribeHeroIntersecting(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getHeroIntersecting() {
  return heroIntersecting;
}

// На сервере нет ни скролла, ни DOM: снапшот — константа «hero виден»,
// поэтому первый HTML-ответ для главной не содержит компактный поиск.
export function getHeroIntersectingServerSnapshot() {
  return true;
}
