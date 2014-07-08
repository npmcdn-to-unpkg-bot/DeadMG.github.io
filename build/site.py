import os
from os import listdir
from os.path import isfile, join
from urllib.parse import urljoin
from mako.template import Template
from mako.lookup import TemplateLookup

def files(mypath):
    return [ f for f in listdir(mypath) if isfile(join(mypath,f)) ]
       	
def ensure_dir(f):
    d = os.path.dirname(f)
    if not os.path.exists(d):
        os.makedirs(d)
        
lookup = TemplateLookup(['.'])	
def make_file(path, func, **kwargs):
    result_path = os.path.join('../', os.path.relpath(path, 'data'))
    ensure_dir(result_path)
    output = open(result_path, 'w+')
    output.write(func(Template(filename=path, lookup=lookup), path=path, result_path=result_path, **kwargs))
    output.close()       
    
def spew_dir(path, func):
    path = os.path.join('data', path)
    for file in files(path):
        make_file(os.path.join(path, file), func)

def spew_list(files, func):
    for file, name in files:
        make_file(os.path.join('data', file), func, name=name)
        
spew_dir('', lambda template, **kwargs: template.render(**kwargs))
tutorials = [
    ('Tutorial/HelloWorld.html', 'Hello World!'),
]
spew_list(tutorials, lambda template, **kwargs: template.render(files=tutorials, **kwargs))