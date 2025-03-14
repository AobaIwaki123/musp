import os
import glob
import importlib

# __all__ に含めるモジュールを自動で取得
module_files = glob.glob(os.path.join(os.path.dirname(__file__), "*.py"))
__all__ = [os.path.basename(f)[:-3] for f in module_files if not f.endswith("__init__.py")]

# モジュールを動的にインポート
for module in __all__:
    globals()[module] = importlib.import_module(f".{module}", package=__name__)
