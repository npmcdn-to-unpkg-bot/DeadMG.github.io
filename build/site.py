import os
import urllib
import urllib.request
import shutil
from os import listdir
from os.path import isfile, join, isdir
from mako.template import Template
from mako.lookup import TemplateLookup
from mako import exceptions

lookup = TemplateLookup(['.'])
datadir = "data"
builddir = "../"

def copy_dir(to, from_):
    for f in listdir(from_):
        if isdir(join(from_, f)):
            copy_dir(join(to, f), join(from_, f))
        if isfile(join(from_, f)):
            ensure_dir(join(to, f))
            shutil.copyfile(join(from_, f), join(to, f))
            
tutorials = [
    (os.path.join(datadir, 'Tutorial/HelloWorld.html'), 'Hello World!'),
    (os.path.join(datadir, 'Tutorial/LocalVariables.html'), 'Local Variables'),
    (os.path.join(datadir, 'Tutorial/Functions.html'), 'Functions'),
    (os.path.join(datadir, 'Tutorial/OverloadSet.html'), 'Overload Sets'),
    (os.path.join(datadir, 'Tutorial/CPPUsing.html'), 'cpp'),
    (os.path.join(datadir, 'Tutorial/ExportedFunctions.html'), 'Exported Functions'),
]
reference = [
    (
        "Implementation", 
        [
            (
                 os.path.join(datadir, 'Reference/Implementation/Lexer.html'), 
                 'Lexer', 
                 [
                     (
                         os.path.join(datadir, 'Reference/Implementation/Lexer/lexerh.html'),
                         'Lexer.h'
                     ),
                     (
                         os.path.join(datadir, 'Reference/Implementation/Lexer/tokenh.html'),
                         'Token.h'
                     ),
                     (
                         os.path.join(datadir, 'Reference/Implementation/Lexer/lexercpp.html'),
                         'Lexer.cpp'
                     ),
                 ]
            ),
            (os.path.join(datadir, 'Reference/Implementation/Parser.html'), 'Parser', []),
            (os.path.join(datadir, 'Reference/Implementation/Analyzer.html'), 'Analyzer', []),
            (os.path.join(datadir, 'Reference/Implementation/CAPI.html'), 'CAPI', []),
            (os.path.join(datadir, 'Reference/Implementation/CLI.html'), 'CLI', []),
            (os.path.join(datadir, 'Reference/Implementation/Util.html'), 'Util', [])
        ]
    ),
    (
        "Syntax", 
        [
            (os.path.join(datadir, 'Reference/Syntax/Lexical.html'), 'Lexical', []),
            (os.path.join(datadir, 'Reference/Syntax/Grammar.html'), 'Grammar', []),
        ]
    ),
    (
        "Semantics", 
        [
            (os.path.join(datadir, 'Reference/Semantics/Type.html'), 'Type', []),
            (os.path.join(datadir, 'Reference/Semantics/AggregateType.html'), 'AggregateType', []),
            (os.path.join(datadir, 'Reference/Semantics/MetaType.html'), 'MetaType', []),
            (os.path.join(datadir, 'Reference/Semantics/PrimitiveType.html'), 'PrimitiveType', []),
            (os.path.join(datadir, 'Reference/Semantics/OverloadSet.html'), 'OverloadSet', []),
            (os.path.join(datadir, 'Reference/Semantics/CPPNamespace.html'), 'CPPNamespace', []),
            (os.path.join(datadir, 'Reference/Semantics/UserDefinedType.html'), 'UserDefinedType', []),
        ]
    ),
    (
        "Library", 
        [
        ]
    )
]

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
    
def make_file(path, **kwargs):
    result_path = get_result_path(path)
    ensure_dir(result_path)
    output = open(result_path, 'w+')
    try:
        output.write(Template(filename=path, lookup=lookup).render(path=path, get_result_path=get_result_path, tutorials=tutorials, reference=reference, get_url_to_from=get_url_to_from, get_data_path=get_data_path, **kwargs))
    except:
        print(exceptions.text_error_template().render())
    output.close()       
                       
for file in files(datadir):
    make_file(os.path.join(datadir, file)) 
    
for file, name in tutorials:
    make_file(file, name=name)
    
for subfolder, files in reference:
    for file, name, subfiles in files:
        make_file(file, name=name)
        for subfile, subname in subfiles:
            make_file(subfile, name=subname)
        
copy_dir(os.path.join(builddir, 'css'), os.path.join(datadir, 'css'))