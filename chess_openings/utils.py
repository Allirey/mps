#!/bin/python3

import json
import re
import sys
import argparse


def normalize_pgn(pgn: str) -> str:
    pgn = pgn.replace('\r\n', '\n')
    pgn = re.sub(r'^;.*$', '', pgn)
    pgn = re.sub(r'\\"', '', pgn)
    pgn = re.sub(r'\]\n{2,}', ']\n\n', pgn)
    pgn = re.sub(r'\n\n+\[', '\n\n\n[', pgn)

    return pgn


def pgn_to_json(pgn: str, comments: bool = True, raise_exception=False) -> list:
    """
    parse PGN, convert to JSON and returns list of converted games

    Args:
        pgn: PGN as string
        comments: leave or not game comments
        raise_exception: raise exception on first error during converting

    Returns:
        None
    """

    res = []
    errors = []

    pgn = normalize_pgn(pgn)

    games = list(filter(lambda x: len(x) > 0, pgn.split('\n\n\n')))
    for i, game in enumerate(games, start=1):
        try:
            headers_raw, moves, *_ = game.split('\n\n')

            headers = {}
            for header in headers_raw.split('\n'):
                key = re.search(r'\[.*? ', header)[0][1:-1]
                value = re.search(r'\".*?\"', header)[0][1:-1].strip()

                headers[key] = value

            moves = re.sub(r'\d+\.\.\.|\d+\.', '', moves)
            moves = re.sub(r'(\)|\(|\$\d+)', r' \1 ', moves)

            stack = []
            current_move_stack = []
            last_move = {'fen': headers.get('FEN')}

            for token in list(filter(lambda x: x, re.split(r'({[\w\W]*?})|\s', moves)))[:-1]:
                if token.startswith('{'):
                    if comments:
                        last_move['comment'] = token[1:-1].strip()
                elif token.startswith('$'):
                    if 'nag' in last_move:
                        last_move['nag'].append(token)
                    else:
                        last_move['nag'] = [token]

                elif token == '(':
                    new_move_stack = []
                    if 'variations' in last_move:
                        last_move['variations'].append(new_move_stack)
                    else:
                        last_move['variations'] = [new_move_stack]
                    stack.append((current_move_stack, last_move))

                    last_move = None if len(current_move_stack) <= 1 else current_move_stack[-2]

                    current_move_stack = new_move_stack

                elif token == ')':
                    current_move_stack, last_move = stack.pop()

                else:
                    new_move = {'san': token}

                    last_move = new_move
                    current_move_stack.append(last_move)

            res.append({'headers': headers, 'moves': current_move_stack})

        except Exception as e:
            if raise_exception:
                raise Exception(f'Error happens during converting pgn to json. game: {str(i)}. Error message: {e}')
            errors.append(str(i))
            print(e)

    if errors:
        print(f'games with errors: {", ".join(errors)}')
    else:
        print('Successfully converted!')

    return res


def process_pgn(path_to_file, ignore_comments=False):
    with open(path_to_file, 'r') as f:
        pgn_data = f.read()

        result = pgn_to_json(pgn_data, comments=not ignore_comments, raise_exception=False)

    with open(f'{path_to_file}.json', 'w') as dest:
        json.dump(result, dest, indent=2)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(add_help=True, description="Convert pgn to json")

    parser.add_argument('filename', action='store', metavar="pathname",
                        help='path to your pgn file')
    parser.add_argument('-ic', action='store_true',
                        help='ignore comments. Converts ignoring text commentaries')

    if len(sys.argv) == 1:
        parser.print_help()
        sys.exit(1)

    options = parser.parse_args()
    process_pgn(options.filename, options.ic)
