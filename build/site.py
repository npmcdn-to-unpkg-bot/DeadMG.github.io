import os
import urllib
import urllib.request
from os import listdir
from os.path import isfile, join
from mako.template import Template
from mako.lookup import TemplateLookup

lookup = TemplateLookup(['.'])
datadir = "data"
builddir = "../"

def files(mypath):
    return [ f for f in listdir(mypath) if isfile(join(mypath,f)) ]
       	
def ensure_dir(f):
    d = os.path.dirname(f)
    if not os.path.exists(d):
        os.makedirs(d)
        
def get_data_path(path):
    return os.path.relpath(path, datadir)
    
def get_result_path(path):
    return os.path.join(builddir, get_data_path(path))
    
def get_url_to_from(to, from_):
    return urllib.request.pathname2url(os.path.relpath(get_result_path(to), os.path.dirname(get_result_path(from_))))
    
def make_file(path, func, **kwargs):
    result_path = get_result_path(path)
    ensure_dir(result_path)
    output = open(result_path, 'w+')
    output.write(func(Template(filename=path, lookup=lookup), path=path, get_result_path=get_result_path, get_url_to_from=get_url_to_from, get_data_path=get_data_path, **kwargs))
    output.close()       
    
def spew_dir(path, func):
    for file in files(path):
        make_file(os.path.join(path, file), func)

def spew_list(files, func):
    for file, name in files:
        make_file(file, func, name=name)
        
tutorials = [
    (os.path.join(datadir, 'Tutorial/HelloWorld.html'), 'Hello World!'),
    (os.path.join(datadir, 'Tutorial/LocalVariables.html'), 'Local Variables'),
    (os.path.join(datadir, 'Tutorial/Functions.html'), 'Functions'),
]
spew_dir(datadir, lambda template, **kwargs: template.render(tutorials=tutorials, **kwargs))
spew_list(tutorials, lambda template, **kwargs: template.render(files=tutorials, tutorials=tutorials, **kwargs))