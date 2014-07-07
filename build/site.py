import os
from os import listdir
from os.path import isfile, join
from urllib.parse import urljoin

def files(mypath):
    return [ f for f in listdir(mypath) if isfile(join(mypath,f)) ]

def splitall(path):
    allparts = []
    while 1:
        parts = os.path.split(path)
        if parts[0] == path:  # sentinel for absolute paths
            allparts.insert(0, parts[0])
            break
        elif parts[1] == path: # sentinel for relative paths
            allparts.insert(0, parts[1])
            break
        else:
            path = parts[0]
            allparts.insert(0, parts[1])
    return allparts
    
def header(path, result_path):
    start = contents("header.html")
    dirs = splitall(path)
    dirs.pop()
    dirs.pop(0)
    if (len(dirs) > 0):
        base = "../"
        index = "index.html"
        currdir = ""
        getcurdir = lambda: os.path.normpath(os.path.relpath(urljoin(base, currdir, index), os.path.dirname(result_path)))
        start += '<ol class="breadcrumb">'
        start += '<li><a href="' + getcurdir() + '">Home</a></li>'
        for dir in dirs:
            currdir = urljoin(currdir, dir)
            start += '<li><a href="' + getcurdir() + '">' + dir + '</a></li>'
        root, ext = os.path.splitext(os.path.basename(path))
        start += '<li class="active">' + root + '</li></ol>'
    return start
        

def footer(path):
    return contents("footer.html")
    
def contents(path):
    return open(path, 'r').read()
		
def make_file(path, func):
    result_path = os.path.join('../', os.path.relpath(path, 'data'))
    ensure_dir(result_path)
    output = open(result_path, 'w+')
    output.write(header(path, result_path))
    output.write(func(path))
    output.write(footer(path))
    output.close()       
    
def spew_dir(path, func):
    for file in files(path):
        make_file(os.path.join(path, file), func)

pages = {
    '': lambda x: spew_dir(x, contents),
    'Tutorial': lambda x: spew_dir(x, contents),
}
def ensure_dir(f):
    d = os.path.dirname(f)
    if not os.path.exists(d):
        os.makedirs(d)
        
for path, func in pages.items():
    func(os.path.join('data', path))