# Elektro-Bud

## Opis problemu

Pracownik magazynu potrzebuje prostego sposobu na sprawdzanie, jakie produkty są dostępne, ile ich pozostało oraz które pozycje należy uzupełnić. Ręczne prowadzenie listy utrudnia wyszukiwanie produktów i zwiększa ryzyko pomyłek.

Projekt realizuje wybrany fragment systemu Elektro-Bud: ewidencję podstawowych danych o produktach w przeglądarce.

## Wymagania funkcjonalne

1. wyświetlanie listy produktów;
2. dodawanie produktu;
3. edycja produktu;
4. usuwanie produktu po potwierdzeniu;
5. wyszukiwanie po kodzie, nazwie i kategorii;
6. obliczanie liczby produktów, łącznej liczby sztuk i liczby produktów z niskim stanem;
7. walidacja pól i unikalności kodu;
8. przechowywanie danych w localStorage.

## Wymagania niefunkcjonalne

1. System wyświetla zapisane produkty w tabeli.
2. System umożliwia dodanie produktu z kodem, nazwą, kategorią, ceną, stanem ilościowym i stanem minimalnym.
3. System umożliwia edycję istniejącego produktu.
4. System umożliwia usunięcie produktu po potwierdzeniu.
5. System filtruje listę podczas wpisywania frazy w wyszukiwarkę.
6. System oznacza produkt jako „Niski stan”, gdy ilość jest mniejsza lub równa stanowi minimalnemu.
7. System nie pozwala zapisać pustego kodu, nazwy ani kategorii.
8. System nie pozwala zapisać ujemnej ceny lub ujemnych stanów ani ułamkowej liczby sztuk.
9. Kod produktu musi być unikalny; porównanie nie rozróżnia wielkości liter.
10. Dane są zapisywane w przeglądarce i wczytywane po ponownym otwarciu strony.