#!/usr/bin/python
import sys
from urllib.request import urlopen, Request


class Scraper(object):
    """
    Class for extracting text from a scraped page.

    Attributes:
        data: the text being examined
        pos: position of the current "cursor" within the text
    """
    def __init__(self, text):
        self.data = text
        print("scraped %d bytes\n" % len(self.data))
        self.pos = 0

    def move_to(self, key):
        """Move the cursor to the right after the next appearance of key"""
        p = self.data.find(key, self.pos)
        if p > -1:
            dist = p - self.pos
            self.pos = p + len(key)
            return dist
        else:
            return -1

    def move_back(self, key):
        """Move the cursor to the right after the previous appearance of key"""
        p = self.data.rfind(key, 0, self.pos)
        if p > -1:
            dist = self.pos - p
            self.pos = p + len(key)
            return dist
        else:
            return -1

    def scout(self, key):
        """Look for a key, but don't move the cursor"""
        p = self.data.find(key, self.pos)
        if p > -1:
            return p
        else:
            return -1

    def comes_before(self, key, other):
        """Searches from current cursor position to see whether key occurs before other"""
        pos_key = self.scout(key)
        pos_other = self.scout(other)
        if pos_key >= 0:
            if pos_other == -1:
                return True
            else:
                return pos_key < pos_other
        else:
            return False

    def comes_first(self, choices):
        """Searches from cursor and returns the first key from a group that appears"""
        first_choice = None
        first_pos = sys.maxsize
        for choice in choices:
            pos = self.scout(choice)
            if (pos > -1) and (pos < first_pos):
                first_choice = choice
                first_pos = pos
        return first_choice

    def peek(self, rng):
        """Return a snippet of text without moving the cursor"""
        start = max(0, self.pos - rng)
        end = min(len(self.data), self.pos + rng)
        return str(self.pos) + ": " + self.data[start:self.pos] + "|" + self.data[self.pos:end]

    def pull_until(self, key):
        """Return all text between current cursor position and key, then move cursor to after the key"""
        pos_end = self.data.index(key, self.pos)  # pull functions throw an exception if we don't find the key!

        good = self.data[self.pos:pos_end]
        self.pos = pos_end + len(key)
        return good

    def pull_from_to(self, key_start, key_end):
        """Return all text between two keys, then move cursor to after the second key"""
        self.pos = self.data.index(key_start, self.pos) + len(key_start)
        return self.pull_until(key_end)

    def pull_line(self):  # returns the rest of the current line (getting rid of the newline)
        return self.pull_until("\n")


class UrlScraper(Scraper):
    """Scraper subclass for grabbing data from a url"""
    def __init__(self, url, *args, **kwargs):
        assert(url.startswith("http://") or url.startswith("https://"))
        req = Request(url, *args, **kwargs)
        with urlopen(req) as f:
            text = f.read().decode('utf-8')
        super().__init__(text)


class FileScraper(Scraper):
    """Scraper subclass for grabbing data from a file"""
    def __init__(self, fname):
        with open(fname, 'r') as f:
            text = f.read()
        super().__init__(text)