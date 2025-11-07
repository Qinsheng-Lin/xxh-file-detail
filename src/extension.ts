import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

type SortMode = 'name' | 'time' | 'size';

export function activate(context: vscode.ExtensionContext) {
    console.log('File Info Decorator 插件已激活');

    const treeDataProvider = new FileInfoTreeDataProvider();
    
    // 注册自定义树视图，启用拖放功能
    const treeView = vscode.window.createTreeView('fileInfoExplorer', {
        treeDataProvider: treeDataProvider,
        showCollapseAll: true,
        canSelectMany: true,
        dragAndDropController: treeDataProvider,
        manageCheckboxStateManually: false
    });

    context.subscriptions.push(treeView);

    // 启动时自动建立文件索引
    console.log('File Info Decorator: 开始建立文件索引...');
    treeDataProvider.buildFileIndex().then(() => {
        console.log('File Info Decorator: 文件索引建立完成！');
    });

    // 注册快速复制绝对路径命令（inline按钮）
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.quickCopyPath', async (item?: FileItem) => {
            // 如果没有传入item，尝试获取当前选中的项
            if (!item) {
                const selection = treeView.selection;
                if (!selection || selection.length === 0) {
                    vscode.window.showErrorMessage('请先选择文件或文件夹');
                    return;
                }
                item = selection[0];
            }

            await vscode.env.clipboard.writeText(item.resourceUri.fsPath);
            vscode.window.showInformationMessage(
                `✅ 已复制绝对路径\n📋 可在Chat中粘贴 (Cmd+V)\n${item.resourceUri.fsPath}`,
                { modal: false }
            );
        })
    );

    // 注册全部展开命令
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.expandAll', async () => {
            // 获取所有根级文件夹
            const roots = await treeDataProvider.getChildren();
            if (roots) {
                for (const root of roots) {
                    if (root.isDirectory) {
                        await expandRecursively(root);
                    }
                }
            }
            vscode.window.showInformationMessage('已展开所有文件夹');
        })
    );

    // 递归展开文件夹
    async function expandRecursively(item: FileItem): Promise<void> {
        // 展开当前项
        await treeView.reveal(item, { expand: true });
        
        // 获取子项
        const children = await treeDataProvider.getChildren(item);
        if (children) {
            for (const child of children) {
                if (child.isDirectory) {
                    await expandRecursively(child);
                }
            }
        }
    }

    // 注册刷新命令（强制刷新）
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.refresh', () => {
            treeDataProvider.forceRefresh();
            vscode.window.showInformationMessage('已刷新文件列表');
        })
    );

    // 注册排序命令
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.sortByName', () => {
            treeDataProvider.setSortMode('name');
            vscode.window.showInformationMessage('按名称排序');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.sortByTime', () => {
            treeDataProvider.setSortMode('time');
            vscode.window.showInformationMessage('按时间排序');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.sortBySize', () => {
            treeDataProvider.setSortMode('size');
            vscode.window.showInformationMessage('按大小排序');
        })
    );

    // 注册搜索命令
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.search', async () => {
            const searchTerm = await vscode.window.showInputBox({
                prompt: '输入要搜索的文件名',
                placeHolder: '例如: .ts, api, README'
            });
            if (searchTerm !== undefined) {
                treeDataProvider.setSearchTerm(searchTerm);
            }
        })
    );

    // 注册清除搜索命令
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.clearSearch', () => {
            treeDataProvider.setSearchTerm('');
            vscode.window.showInformationMessage('已清除搜索');
        })
    );

    // 注册打开文件命令
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.openFile', (resource: vscode.Uri) => {
            vscode.window.showTextDocument(resource);
        })
    );

    // 注册新建文件命令
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.newFile', async (item?: FileItem) => {
            const folderPath = item?.isDirectory ? item.resourceUri.fsPath : path.dirname(item?.resourceUri.fsPath || '');
            const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
            const targetPath = folderPath || workspacePath;

            if (!targetPath) {
                vscode.window.showErrorMessage('无法确定目标文件夹');
                return;
            }

            const fileName = await vscode.window.showInputBox({
                prompt: '输入文件名',
                placeHolder: '例如: index.ts'
            });

            if (fileName) {
                const filePath = path.join(targetPath, fileName);
                try {
                    fs.writeFileSync(filePath, '');
                    treeDataProvider.forceRefresh();
                    vscode.window.showInformationMessage(`文件已创建: ${fileName}`);
                    // 打开新建的文件
                    setTimeout(() => {
                        vscode.window.showTextDocument(vscode.Uri.file(filePath));
                    }, 100);
                } catch (error) {
                    vscode.window.showErrorMessage(`创建文件失败: ${error}`);
                }
            }
        })
    );

    // 注册新建文件夹命令
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.newFolder', async (item?: FileItem) => {
            const folderPath = item?.isDirectory ? item.resourceUri.fsPath : path.dirname(item?.resourceUri.fsPath || '');
            const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
            const targetPath = folderPath || workspacePath;

            if (!targetPath) {
                vscode.window.showErrorMessage('无法确定目标文件夹');
                return;
            }

            const folderName = await vscode.window.showInputBox({
                prompt: '输入文件夹名',
                placeHolder: '例如: src'
            });

            if (folderName) {
                const newFolderPath = path.join(targetPath, folderName);
                try {
                    fs.mkdirSync(newFolderPath, { recursive: true });
                    treeDataProvider.forceRefresh();
                    vscode.window.showInformationMessage(`文件夹已创建: ${folderName}`);
                } catch (error) {
                    vscode.window.showErrorMessage(`创建文件夹失败: ${error}`);
                }
            }
        })
    );

    // 注册删除命令
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.delete', async (item?: FileItem) => {
            // 如果没有传入item（例如通过快捷键调用），尝试获取当前选中的项
            if (!item) {
                const selection = treeView.selection;
                if (!selection || selection.length === 0) {
                    vscode.window.showErrorMessage('请先选择要删除的文件或文件夹');
                    return;
                }
                item = selection[0];
            }

            const answer = await vscode.window.showWarningMessage(
                `确定要删除 "${item.label}" 吗？`,
                { modal: true },
                '删除'
            );

            if (answer === '删除') {
                try {
                    if (item.isDirectory) {
                        fs.rmSync(item.resourceUri.fsPath, { recursive: true, force: true });
                    } else {
                        fs.unlinkSync(item.resourceUri.fsPath);
                    }
                    treeDataProvider.forceRefresh();
                    vscode.window.showInformationMessage(`已删除: ${item.label}`);
                } catch (error) {
                    vscode.window.showErrorMessage(`删除失败: ${error}`);
                }
            }
        })
    );

    // 注册重命名命令
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.rename', async (item?: FileItem) => {
            // 如果没有传入item（例如通过快捷键调用），尝试获取当前选中的项
            if (!item) {
                const selection = treeView.selection;
                if (!selection || selection.length === 0) {
                    vscode.window.showErrorMessage('请先选择要重命名的文件或文件夹');
                    return;
                }
                item = selection[0];
            }

            const newName = await vscode.window.showInputBox({
                prompt: '输入新名称',
                value: item.label,
                validateInput: (value) => {
                    if (!value) {
                        return '名称不能为空';
                    }
                    if (value.includes('/') || value.includes('\\')) {
                        return '名称不能包含 / 或 \\';
                    }
                    return null;
                }
            });

            if (newName && newName !== item.label) {
                const oldPath = item.resourceUri.fsPath;
                const newPath = path.join(path.dirname(oldPath), newName);
                try {
                    fs.renameSync(oldPath, newPath);
                    treeDataProvider.forceRefresh();
                    vscode.window.showInformationMessage(`已重命名: ${item.label} → ${newName}`);
                } catch (error) {
                    vscode.window.showErrorMessage(`重命名失败: ${error}`);
                }
            }
        })
    );

    // 注册复制路径命令
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.copyPath', (item?: FileItem) => {
            // 如果没有传入item（例如通过快捷键调用），尝试获取当前选中的项
            if (!item) {
                const selection = treeView.selection;
                if (!selection || selection.length === 0) {
                    vscode.window.showErrorMessage('请先选择文件或文件夹');
                    return;
                }
                item = selection[0];
            }

            vscode.env.clipboard.writeText(item.resourceUri.fsPath);
            vscode.window.showInformationMessage('绝对路径已复制，可粘贴到Chat');
        })
    );

    // 注册复制路径用于Chat的命令
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.copyPathForChat', async (item?: FileItem) => {
            // 如果没有传入item，尝试获取当前选中的项
            if (!item) {
                const selection = treeView.selection;
                if (!selection || selection.length === 0) {
                    vscode.window.showErrorMessage('请先选择文件或文件夹');
                    return;
                }
                item = selection[0];
            }

            const config = vscode.workspace.getConfiguration('fileInfoDecorator');
            const useRelativePath = config.get<boolean>('useRelativePathForChat', false);
            
            let pathToCopy: string;
            if (useRelativePath) {
                const workspaceFolder = vscode.workspace.getWorkspaceFolder(item.resourceUri);
                if (workspaceFolder) {
                    pathToCopy = path.relative(workspaceFolder.uri.fsPath, item.resourceUri.fsPath);
                } else {
                    pathToCopy = item.resourceUri.fsPath;
                }
            } else {
                pathToCopy = item.resourceUri.fsPath;
            }
            
            await vscode.env.clipboard.writeText(pathToCopy);
            
            // 尝试多个可能的Cursor Chat命令
            const chatCommands = [
                'aichat.newchat',              // Cursor AI Chat
                'workbench.panel.chat.view.copilot.focus',
                'workbench.action.chat.open',
                'cursor.chat.focus'
            ];
            
            vscode.window.showInformationMessage(
                `✅ 路径已复制: ${pathToCopy}\n📋 在Cursor Chat中粘贴 (Cmd+V)`, 
                '立即打开Chat'
            ).then(async selection => {
                if (selection === '立即打开Chat') {
                    // 尝试打开Cursor Chat，依次尝试多个命令
                    for (const cmd of chatCommands) {
                        try {
                            await vscode.commands.executeCommand(cmd);
                            break; // 如果成功就停止
                        } catch (error) {
                            // 继续尝试下一个命令
                            continue;
                        }
                    }
                }
            });
        })
    );

    // 注册在文件管理器中显示命令
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.revealInFinder', (item?: FileItem) => {
            // 如果没有传入item，尝试获取当前选中的项
            if (!item) {
                const selection = treeView.selection;
                if (!selection || selection.length === 0) {
                    vscode.window.showErrorMessage('请先选择文件或文件夹');
                    return;
                }
                item = selection[0];
            }
            
            vscode.commands.executeCommand('revealFileInOS', item.resourceUri);
        })
    );

    // 注册在侧边打开命令
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.openToSide', (item?: FileItem) => {
            // 如果没有传入item，尝试获取当前选中的项
            if (!item) {
                const selection = treeView.selection;
                if (!selection || selection.length === 0) {
                    vscode.window.showErrorMessage('请先选择文件');
                    return;
                }
                item = selection[0];
            }
            
            if (!item.isDirectory) {
                vscode.commands.executeCommand('vscode.open', item.resourceUri, vscode.ViewColumn.Beside);
            }
        })
    );

    // 注册复制相对路径命令
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.copyRelativePath', (item?: FileItem) => {
            // 如果没有传入item（例如通过快捷键调用），尝试获取当前选中的项
            if (!item) {
                const selection = treeView.selection;
                if (!selection || selection.length === 0) {
                    vscode.window.showErrorMessage('请先选择文件或文件夹');
                    return;
                }
                item = selection[0];
            }

            const workspaceFolder = vscode.workspace.getWorkspaceFolder(item.resourceUri);
            if (workspaceFolder) {
                const relativePath = path.relative(workspaceFolder.uri.fsPath, item.resourceUri.fsPath);
                vscode.env.clipboard.writeText(relativePath);
                vscode.window.showInformationMessage('相对路径已复制到剪贴板');
            } else {
                vscode.env.clipboard.writeText(item.resourceUri.fsPath);
                vscode.window.showInformationMessage('路径已复制到剪贴板');
            }
        })
    );

    // 注册在集成终端中打开命令
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.openInTerminal', (item?: FileItem) => {
            // 如果没有传入item，尝试获取当前选中的项
            if (!item) {
                const selection = treeView.selection;
                if (!selection || selection.length === 0) {
                    vscode.window.showErrorMessage('请先选择文件或文件夹');
                    return;
                }
                item = selection[0];
            }
            
            const terminalPath = item.isDirectory ? item.resourceUri.fsPath : path.dirname(item.resourceUri.fsPath);
            const terminal = vscode.window.createTerminal({
                cwd: terminalPath,
                name: `Terminal - ${path.basename(terminalPath)}`
            });
            terminal.show();
        })
    );

    // 注册剪切命令
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.cut', async (item?: FileItem) => {
            // 如果没有传入item（例如通过快捷键调用），尝试获取当前选中的项
            if (!item) {
                const selection = treeView.selection;
                if (!selection || selection.length === 0) {
                    vscode.window.showErrorMessage('请先选择要剪切的文件或文件夹');
                    return;
                }
                item = selection[0];
            }

            await vscode.env.clipboard.writeText(item.resourceUri.fsPath);
            vscode.window.showInformationMessage('已剪切（可在文件管理器中粘贴）');
            // 存储剪切状态
            context.workspaceState.update('cutItem', item.resourceUri.fsPath);
        })
    );

    // 注册复制命令（复制文件）
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.copy', async (item?: FileItem) => {
            // 如果没有传入item（例如通过快捷键调用），尝试获取当前选中的项
            if (!item) {
                const selection = treeView.selection;
                if (!selection || selection.length === 0) {
                    vscode.window.showErrorMessage('请先选择要复制的文件或文件夹');
                    return;
                }
                item = selection[0];
            }

            await vscode.env.clipboard.writeText(item.resourceUri.fsPath);
            vscode.window.showInformationMessage('已复制（可在文件管理器中粘贴）');
            context.workspaceState.update('cutItem', undefined);
        })
    );

    // 注册粘贴命令
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.paste', async (targetItem?: FileItem) => {
            const clipboardText = await vscode.env.clipboard.readText();
            if (!clipboardText || !fs.existsSync(clipboardText)) {
                vscode.window.showErrorMessage('剪贴板中没有有效的文件路径');
                return;
            }

            const sourcePath = clipboardText;
            const targetDir = targetItem?.isDirectory 
                ? targetItem.resourceUri.fsPath 
                : (targetItem ? path.dirname(targetItem.resourceUri.fsPath) : vscode.workspace.workspaceFolders?.[0]?.uri.fsPath);

            if (!targetDir) {
                vscode.window.showErrorMessage('无法确定目标文件夹');
                return;
            }

            const fileName = path.basename(sourcePath);
            const destPath = path.join(targetDir, fileName);

            try {
                const cutItem = context.workspaceState.get<string>('cutItem');
                if (cutItem === sourcePath) {
                    // 移动（剪切）
                    fs.renameSync(sourcePath, destPath);
                    vscode.window.showInformationMessage(`已移动: ${fileName}`);
                    context.workspaceState.update('cutItem', undefined);
                } else {
                    // 复制
                    if (fs.statSync(sourcePath).isDirectory()) {
                        copyDirectory(sourcePath, destPath);
                    } else {
                        fs.copyFileSync(sourcePath, destPath);
                    }
                    vscode.window.showInformationMessage(`已复制: ${fileName}`);
                }
                treeDataProvider.forceRefresh();
            } catch (error) {
                vscode.window.showErrorMessage(`操作失败: ${error}`);
            }
        })
    );

    // 注册选择以进行比较命令
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.selectForCompare', (item?: FileItem) => {
            // 如果没有传入item，尝试获取当前选中的项
            if (!item) {
                const selection = treeView.selection;
                if (!selection || selection.length === 0) {
                    vscode.window.showErrorMessage('请先选择文件');
                    return;
                }
                item = selection[0];
            }
            
            if (!item.isDirectory) {
                context.workspaceState.update('compareFile', item.resourceUri.fsPath);
                vscode.window.showInformationMessage(`已选择: ${item.label}`);
            }
        })
    );

    // 注册与已选项目比较命令
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.compareWithSelected', async (item?: FileItem) => {
            // 如果没有传入item，尝试获取当前选中的项
            if (!item) {
                const selection = treeView.selection;
                if (!selection || selection.length === 0) {
                    vscode.window.showErrorMessage('请先选择文件');
                    return;
                }
                item = selection[0];
            }
            
            const compareFile = context.workspaceState.get<string>('compareFile');
            if (!compareFile) {
                vscode.window.showErrorMessage('请先选择要比较的文件');
                return;
            }
            if (!item.isDirectory) {
                await vscode.commands.executeCommand('vscode.diff', 
                    vscode.Uri.file(compareFile), 
                    item.resourceUri,
                    `${path.basename(compareFile)} ↔ ${item.label}`
                );
            }
        })
    );

    // 注册查找文件中的引用命令
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.findReferences', (item?: FileItem) => {
            // 如果没有传入item，尝试获取当前选中的项
            if (!item) {
                const selection = treeView.selection;
                if (!selection || selection.length === 0) {
                    vscode.window.showErrorMessage('请先选择文件');
                    return;
                }
                item = selection[0];
            }
            
            if (!item.isDirectory) {
                vscode.commands.executeCommand('references-view.findReferences', item.resourceUri);
            }
        })
    );

    // 注册下载远程文件到本地命令
    context.subscriptions.push(
        vscode.commands.registerCommand('fileInfoDecorator.downloadToLocal', async (item?: FileItem) => {
            // 如果没有传入item，尝试获取当前选中的项
            if (!item) {
                const selection = treeView.selection;
                if (!selection || selection.length === 0) {
                    vscode.window.showErrorMessage('请先选择文件或文件夹');
                    return;
                }
                item = selection[0];
            }

            // 检查是否在远程环境
            const isRemote = vscode.env.remoteName !== undefined;
            if (!isRemote) {
                vscode.window.showInformationMessage('当前不是远程环境，无需下载');
                return;
            }

            // 选择保存位置
            const localPath = await vscode.window.showSaveDialog({
                defaultUri: vscode.Uri.file(path.join(require('os').homedir(), 'Downloads', item.label)),
                filters: item.isDirectory ? undefined : {
                    'All Files': ['*']
                }
            });

            if (!localPath) {
                return; // 用户取消
            }

            try {
                if (item.isDirectory) {
                    // 下载整个文件夹
                    await downloadDirectory(item.resourceUri.fsPath, localPath.fsPath);
                    vscode.window.showInformationMessage(`✅ 文件夹已下载: ${item.label}`);
                } else {
                    // 下载单个文件
                    const content = await vscode.workspace.fs.readFile(item.resourceUri);
                    await vscode.workspace.fs.writeFile(localPath, content);
                    vscode.window.showInformationMessage(`✅ 文件已下载: ${item.label}`);
                }
            } catch (error) {
                vscode.window.showErrorMessage(`下载失败: ${error}`);
            }
        })
    );

    // 递归下载文件夹
    async function downloadDirectory(remotePath: string, localPath: string): Promise<void> {
        // 创建本地文件夹
        await vscode.workspace.fs.createDirectory(vscode.Uri.file(localPath));

        // 读取远程文件夹内容
        const entries = await vscode.workspace.fs.readDirectory(vscode.Uri.file(remotePath));

        for (const [name, type] of entries) {
            const remoteFilePath = path.join(remotePath, name);
            const localFilePath = path.join(localPath, name);

            if (type === vscode.FileType.Directory) {
                // 递归下载子文件夹
                await downloadDirectory(remoteFilePath, localFilePath);
            } else {
                // 下载文件
                const content = await vscode.workspace.fs.readFile(vscode.Uri.file(remoteFilePath));
                await vscode.workspace.fs.writeFile(vscode.Uri.file(localFilePath), content);
            }
        }
    }

    // 注册拖放文件到编辑器的处理器
    const dropProvider: vscode.DocumentDropEditProvider = {
        provideDocumentDropEdits: async (document, position, dataTransfer, token) => {
            // 获取拖放的文件URI
            const uriListItem = dataTransfer.get('text/uri-list');
            if (!uriListItem) {
                return undefined;
            }

            const uriListText = await uriListItem.asString();
            const uris = uriListText.split('\n').filter(line => line.trim().length > 0);
            
            if (uris.length === 0) {
                return undefined;
            }

            const config = vscode.workspace.getConfiguration('fileInfoDecorator');
            const useRelativePath = config.get<boolean>('useRelativePathOnDrop', true);
            const openFileOnDrop = config.get<boolean>('openFileOnDrop', true);
            
            const snippets: vscode.SnippetString[] = [];
            const fileUrisToOpen: vscode.Uri[] = [];
            
            for (const uriStr of uris) {
                try {
                    const uri = vscode.Uri.parse(uriStr.trim());
                    if (uri.scheme !== 'file') {
                        continue;
                    }

                    // 检查是否是文件（不是文件夹）
                    try {
                        const stats = fs.statSync(uri.fsPath);
                        if (stats.isFile()) {
                            fileUrisToOpen.push(uri);
                        }
                    } catch (err) {
                        console.error('检查文件状态失败:', err);
                    }

                    let pathToInsert: string;
                    
                    if (useRelativePath) {
                        // 使用相对路径
                        const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
                        if (workspaceFolder) {
                            pathToInsert = path.relative(workspaceFolder.uri.fsPath, uri.fsPath);
                        } else {
                            pathToInsert = uri.fsPath;
                        }
                    } else {
                        // 使用绝对路径
                        pathToInsert = uri.fsPath;
                    }

                    const snippet = new vscode.SnippetString();
                    snippet.appendText(pathToInsert);
                    snippets.push(snippet);
                } catch (error) {
                    console.error('解析URI失败:', error);
                }
            }

            if (snippets.length === 0) {
                return undefined;
            }

            // 异步打开文件预览（如果配置开启）
            if (openFileOnDrop && fileUrisToOpen.length > 0) {
                setTimeout(async () => {
                    for (const uri of fileUrisToOpen) {
                        try {
                            // 在侧边打开文件预览
                            await vscode.window.showTextDocument(uri, {
                                viewColumn: vscode.ViewColumn.Beside,
                                preview: true,
                                preserveFocus: true
                            });
                        } catch (error) {
                            console.error('打开文件预览失败:', error);
                        }
                    }
                }, 100);
            }

            // 返回编辑操作
            const edit = new vscode.DocumentDropEdit(snippets.join('\n'));
            return edit;
        }
    };

    // 为所有文件类型注册拖放提供器
    context.subscriptions.push(
        vscode.languages.registerDocumentDropEditProvider(
            { scheme: 'file' },
            dropProvider
        )
    );

    // 监听配置变化
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('fileInfoDecorator')) {
                treeDataProvider.refresh();
            }
        })
    );

    // 监听文件系统变化 - 使用forceRefresh确保立即更新，并更新索引
    const watcher = vscode.workspace.createFileSystemWatcher('**/*');
    
    // 添加延迟刷新，避免频繁触发
    let fileWatcherTimeout: NodeJS.Timeout | undefined;
    const scheduleRefresh = () => {
        if (fileWatcherTimeout) {
            clearTimeout(fileWatcherTimeout);
        }
        fileWatcherTimeout = setTimeout(() => {
            treeDataProvider.forceRefresh();
            fileWatcherTimeout = undefined;
        }, 200); // 200ms延迟，收集多个变化一起刷新
    };

    context.subscriptions.push(
        watcher.onDidChange(uri => {
            // 文件修改，更新索引
            treeDataProvider.updateFileInIndex(uri.fsPath);
            scheduleRefresh();
        }),
        watcher.onDidCreate(uri => {
            // 文件创建，添加到索引
            treeDataProvider.addFileToIndex(uri.fsPath);
            scheduleRefresh();
        }),
        watcher.onDidDelete(uri => {
            // 文件删除，从索引移除
            treeDataProvider.removeFileFromIndex(uri.fsPath);
            scheduleRefresh();
        }),
        watcher
    );
}

class FileInfoTreeDataProvider implements vscode.TreeDataProvider<FileItem>, vscode.TreeDragAndDropController<FileItem> {
    dropMimeTypes = ['application/vnd.code.tree.fileInfoExplorer'];
    dragMimeTypes = ['text/uri-list', 'text/plain'];

    private _onDidChangeTreeData = new vscode.EventEmitter<FileItem | undefined | null | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
    private sortMode: SortMode = 'name';
    private searchTerm: string = '';
    private refreshTimeout?: NodeJS.Timeout;
    private fileCache: Map<string, { items: FileItem[], timestamp: number }> = new Map();
    private readonly CACHE_DURATION = 1000; // 缓存1秒
    
    // 文件索引系统
    private fileIndex: Map<string, FileItem> = new Map(); // key: 文件名小写, value: FileItem
    private indexBuilt: boolean = false;
    private indexing: boolean = false;

    refresh(): void {
        // 清除所有缓存，强制重新读取
        this.fileCache.clear();
        
        // 防抖：避免频繁刷新
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
        }
        
        this.refreshTimeout = setTimeout(() => {
            this._onDidChangeTreeData.fire();
            this.refreshTimeout = undefined;
        }, 100); // 100ms防抖
    }

    forceRefresh(): void {
        // 立即强制刷新，不经过防抖
        this.fileCache.clear();
        // 刷新时重建索引
        this.indexBuilt = false;
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
            this.refreshTimeout = undefined;
        }
        this._onDidChangeTreeData.fire();
    }

    setSortMode(mode: SortMode): void {
        this.sortMode = mode;
        this.refresh();
    }

    setSearchTerm(term: string): void {
        this.searchTerm = term.toLowerCase();
        this.refresh();
    }
    
    // 建立文件索引（公开方法）
    public async buildFileIndex(): Promise<void> {
        if (this.indexing) {
            return;
        }
        
        this.indexing = true;
        this.fileIndex.clear();
        
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            this.indexing = false;
            return;
        }
        
        console.log('开始建立文件索引...');
        const startTime = Date.now();
        
        for (const folder of workspaceFolders) {
            await this.indexDirectory(folder.uri.fsPath);
        }
        
        const duration = Date.now() - startTime;
        const fileCount = Array.from(this.fileIndex.values()).filter(item => !item.isDirectory).length;
        const folderCount = Array.from(this.fileIndex.values()).filter(item => item.isDirectory).length;
        console.log(`文件索引建立完成！共索引 ${fileCount} 个文件，${folderCount} 个文件夹，耗时 ${duration}ms`);
        
        this.indexBuilt = true;
        this.indexing = false;
    }
    
    // 递归索引目录
    private async indexDirectory(dirPath: string): Promise<void> {
        try {
            const entries = fs.readdirSync(dirPath, { withFileTypes: true });
            const config = vscode.workspace.getConfiguration('fileInfoDecorator');
            const showOnFolders = config.get<boolean>('showOnFolders', false);
            
            for (const entry of entries) {
                // 跳过隐藏文件和常见的大型目录
                if (entry.name.startsWith('.') || 
                    entry.name === 'node_modules' || 
                    entry.name === 'dist' || 
                    entry.name === 'build' ||
                    entry.name === 'out') {
                    continue;
                }
                
                const fullPath = path.join(dirPath, entry.name);
                
                try {
                    const stats = fs.statSync(fullPath);
                    const isDirectory = entry.isDirectory();
                    
                    // 将文件/文件夹添加到索引
                    const fileItem = new FileItem(
                        entry.name,
                        vscode.Uri.file(fullPath),
                        isDirectory,
                        isDirectory && !showOnFolders ? undefined : stats.mtime,
                        isDirectory && !showOnFolders ? undefined : stats.size,
                        false
                    );
                    
                    // 使用文件名小写作为key，支持不区分大小写搜索
                    const key = entry.name.toLowerCase();
                    this.fileIndex.set(fullPath, fileItem);
                    
                    // 如果是目录，递归索引
                    if (isDirectory) {
                        await this.indexDirectory(fullPath);
                    }
                } catch (err) {
                    // 忽略无法访问的文件
                }
            }
        } catch (error) {
            // 忽略无法访问的目录
        }
    }

    getTreeItem(element: FileItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: FileItem): Promise<FileItem[]> {
        if (!element) {
            // 根目录：显示工作区文件夹
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                return [];
            }

            const items: FileItem[] = [];
            for (const folder of workspaceFolders) {
                try {
                    // 确保每次都重新读取文件系统状态
                    const stats = fs.statSync(folder.uri.fsPath);
                    items.push(new FileItem(
                        folder.name,
                        vscode.Uri.file(folder.uri.fsPath),
                        true,
                        stats.mtime,
                        undefined,
                        true // isWorkspaceFolder
                    ));
                } catch (error) {
                    console.error(`读取工作区文件夹失败: ${folder.uri.fsPath}`, error);
                }
            }
            return items;
        } else {
            // 子目录
            if (element.isDirectory) {
                return await this.getFilesInDirectory(element.resourceUri.fsPath);
            }
            return [];
        }
    }

    private async getFilesInDirectory(dirPath: string): Promise<FileItem[]> {
        try {
            // 检查缓存（但对于用户主动刷新，缓存已被清除）
            const now = Date.now();
            const cached = this.fileCache.get(dirPath);
            if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
                return cached.items;
            }

            // 强制重新读取目录
            const entries = fs.readdirSync(dirPath, { withFileTypes: true });
            const items: FileItem[] = [];
            const config = vscode.workspace.getConfiguration('fileInfoDecorator');
            const showOnFolders = config.get<boolean>('showOnFolders', false);

            for (const entry of entries) {
                // 跳过隐藏文件（除非搜索时）
                if (entry.name.startsWith('.') && !this.searchTerm) {
                    continue;
                }

                const fullPath = path.join(dirPath, entry.name);
                try {
                    // 每次都重新获取文件状态，确保是最新的
                    const stats = fs.statSync(fullPath);
                    const isDirectory = entry.isDirectory();

                    // 搜索过滤：如果有搜索词，检查文件名是否匹配或子文件夹是否包含匹配项
                    if (this.searchTerm) {
                        const nameMatches = entry.name.toLowerCase().includes(this.searchTerm);
                        
                        // 如果是文件夹，需要检查子文件夹是否有匹配项
                        if (isDirectory) {
                            const hasMatchingChildren = await this.hasMatchingChildren(fullPath);
                            // 只有文件夹名匹配或子文件夹有匹配项时才显示
                            if (!nameMatches && !hasMatchingChildren) {
                                continue;
                            }
                        } else {
                            // 如果是文件，必须名称匹配
                            if (!nameMatches) {
                                continue;
                            }
                        }
                    }

                    // 如果是文件夹且不显示文件夹信息，跳过信息显示
                    if (isDirectory && !showOnFolders) {
                        items.push(new FileItem(
                            entry.name,
                            vscode.Uri.file(fullPath),
                            isDirectory,
                            undefined,
                            undefined,
                            false
                        ));
                    } else {
                        items.push(new FileItem(
                            entry.name,
                            vscode.Uri.file(fullPath),
                            isDirectory,
                            stats.mtime,
                            stats.size,
                            false
                        ));
                    }
                } catch (err) {
                    console.error(`读取文件失败: ${fullPath}`, err);
                    // 忽略无法访问的文件
                }
            }

            // 排序
            this.sortItems(items);

            // 更新缓存
            this.fileCache.set(dirPath, { items, timestamp: now });

            return items;
        } catch (error) {
            console.error(`读取目录失败: ${dirPath}`, error);
            return [];
        }
    }

    // 从索引中搜索（快速）
    private async searchFromIndex(): Promise<FileItem[]> {
        const results: FileItem[] = [];
        
        console.log(`从索引搜索: "${this.searchTerm}", 索引大小: ${this.fileIndex.size}`);
        
        for (const [fullPath, fileItem] of this.fileIndex.entries()) {
            // 检查文件名或文件夹名是否包含搜索词
            if (fileItem.label.toLowerCase().includes(this.searchTerm)) {
                results.push(fileItem);
            }
        }
        
        const fileCount = results.filter(item => !item.isDirectory).length;
        const folderCount = results.filter(item => item.isDirectory).length;
        console.log(`搜索完成，找到 ${fileCount} 个文件，${folderCount} 个文件夹`);
        return results;
    }
    
    // 添加文件到索引
    public addFileToIndex(filePath: string): void {
        if (!this.indexBuilt) {
            return; // 索引未建立，不处理
        }
        
        try {
            // 检查是否应该跳过
            const fileName = path.basename(filePath);
            if (fileName.startsWith('.') || 
                filePath.includes('node_modules') || 
                filePath.includes('/dist/') ||
                filePath.includes('/build/') ||
                filePath.includes('/out/')) {
                return;
            }
            
            const stats = fs.statSync(filePath);
            const isDirectory = stats.isDirectory();
            const config = vscode.workspace.getConfiguration('fileInfoDecorator');
            const showOnFolders = config.get<boolean>('showOnFolders', false);
            
            const fileItem = new FileItem(
                fileName,
                vscode.Uri.file(filePath),
                isDirectory,
                isDirectory && !showOnFolders ? undefined : stats.mtime,
                isDirectory && !showOnFolders ? undefined : stats.size,
                false
            );
            
            this.fileIndex.set(filePath, fileItem);
            console.log(`索引已添加${isDirectory ? '文件夹' : '文件'}: ${fileName}`);
        } catch (err) {
            // 文件可能已被删除或无法访问
        }
    }
    
    // 从索引中移除文件或文件夹
    public removeFileFromIndex(filePath: string): void {
        if (this.fileIndex.has(filePath)) {
            const item = this.fileIndex.get(filePath);
            this.fileIndex.delete(filePath);
            console.log(`索引已移除${item?.isDirectory ? '文件夹' : '文件'}: ${path.basename(filePath)}`);
        }
    }
    
    // 更新索引中的文件
    public updateFileInIndex(filePath: string): void {
        // 先移除旧的，再添加新的
        this.removeFileFromIndex(filePath);
        this.addFileToIndex(filePath);
    }
    
    // 检查文件夹是否包含匹配的子项
    private async hasMatchingChildren(dirPath: string): Promise<boolean> {
        try {
            const entries = fs.readdirSync(dirPath, { withFileTypes: true });
            
            for (const entry of entries) {
                // 跳过隐藏文件和大型目录
                if (entry.name.startsWith('.') || 
                    entry.name === 'node_modules' || 
                    entry.name === 'dist' || 
                    entry.name === 'build' ||
                    entry.name === 'out') {
                    continue;
                }
                
                // 如果文件名匹配
                if (entry.name.toLowerCase().includes(this.searchTerm)) {
                    return true;
                }
                
                // 如果是文件夹，递归检查
                if (entry.isDirectory()) {
                    const fullPath = path.join(dirPath, entry.name);
                    if (await this.hasMatchingChildren(fullPath)) {
                        return true;
                    }
                }
            }
        } catch (err) {
            // 忽略错误
        }
        
        return false;
    }
    
    // 递归搜索文件（备用方案，当索引未建立时使用）
    private async searchFilesRecursively(dirPath: string): Promise<FileItem[]> {
        const results: FileItem[] = [];
        const config = vscode.workspace.getConfiguration('fileInfoDecorator');
        const showOnFolders = config.get<boolean>('showOnFolders', false);

        try {
            const entries = fs.readdirSync(dirPath, { withFileTypes: true });

            for (const entry of entries) {
                // 跳过隐藏文件和常见的大型目录
                if (entry.name.startsWith('.') || 
                    entry.name === 'node_modules' || 
                    entry.name === 'dist' || 
                    entry.name === 'build' ||
                    entry.name === 'out') {
                    continue;
                }

                const fullPath = path.join(dirPath, entry.name);
                
                try {
                    const stats = fs.statSync(fullPath);
                    const isDirectory = entry.isDirectory();

                    // 如果文件/文件夹名匹配搜索词
                    if (entry.name.toLowerCase().includes(this.searchTerm)) {
                        if (isDirectory && !showOnFolders) {
                            results.push(new FileItem(
                                entry.name,
                                vscode.Uri.file(fullPath),
                                isDirectory,
                                undefined,
                                undefined,
                                false
                            ));
                        } else {
                            results.push(new FileItem(
                                entry.name,
                                vscode.Uri.file(fullPath),
                                isDirectory,
                                stats.mtime,
                                stats.size,
                                false
                            ));
                        }
                    }

                    // 如果是文件夹，递归搜索
                    if (isDirectory) {
                        const subResults = await this.searchFilesRecursively(fullPath);
                        results.push(...subResults);
                    }
                } catch (err) {
                    console.error(`搜索文件失败: ${fullPath}`, err);
                }
            }
        } catch (error) {
            console.error(`搜索目录失败: ${dirPath}`, error);
        }

        return results;
    }

    private sortItems(items: FileItem[]): void {
        items.sort((a, b) => {
            // 文件夹始终在前
            if (a.isDirectory && !b.isDirectory) return -1;
            if (!a.isDirectory && b.isDirectory) return 1;

            // 根据排序模式
            switch (this.sortMode) {
                case 'time':
                    if (a.modifiedDate && b.modifiedDate) {
                        return b.modifiedDate.getTime() - a.modifiedDate.getTime(); // 最新的在前
                    }
                    return a.label.localeCompare(b.label);
                
                case 'size':
                    if (a.fileSize !== undefined && b.fileSize !== undefined) {
                        return b.fileSize - a.fileSize; // 大的在前
                    }
                    return a.label.localeCompare(b.label);
                
                case 'name':
                default:
                    return a.label.localeCompare(b.label);
            }
        });
    }

    // 实现拖放功能（仅用于移动文件，不复制路径）
    public async handleDrag(source: readonly FileItem[], dataTransfer: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {
        // 设置自定义mime type用于树内部拖放
        dataTransfer.set('application/vnd.code.tree.fileInfoExplorer', new vscode.DataTransferItem(source));
        
        // 设置text/uri-list用于拖放到编辑器
        const uris = source.map(item => item.resourceUri.toString()).join('\n');
        dataTransfer.set('text/uri-list', new vscode.DataTransferItem(uris));
    }

    public async handleDrop(target: FileItem | undefined, dataTransfer: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {
        const transferItem = dataTransfer.get('application/vnd.code.tree.fileInfoExplorer');
        if (!transferItem) {
            return;
        }

        const source = transferItem.value as FileItem[];
        if (!source || source.length === 0) {
            return;
        }

        // 确定目标文件夹
        let targetPath: string;
        if (!target) {
            // 拖到根目录
            targetPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
        } else if (target.isDirectory) {
            targetPath = target.resourceUri.fsPath;
        } else {
            targetPath = path.dirname(target.resourceUri.fsPath);
        }

        if (!targetPath) {
            return;
        }

        // 移动文件/文件夹
        for (const item of source) {
            const sourcePath = item.resourceUri.fsPath;
            const destPath = path.join(targetPath, item.label);

            // 检查是否移动到自己
            if (sourcePath === destPath) {
                continue;
            }

            // 检查是否移动到自己的子文件夹
            if (destPath.startsWith(sourcePath + path.sep)) {
                vscode.window.showErrorMessage(`不能将文件夹移动到自己的子文件夹中`);
                continue;
            }

            try {
                // 如果目标已存在，询问是否覆盖
                if (fs.existsSync(destPath)) {
                    const answer = await vscode.window.showWarningMessage(
                        `目标位置已存在 "${item.label}"，是否覆盖？`,
                        '覆盖', '跳过'
                    );
                    if (answer !== '覆盖') {
                        continue;
                    }
                    // 删除已存在的文件/文件夹
                    if (fs.statSync(destPath).isDirectory()) {
                        fs.rmSync(destPath, { recursive: true, force: true });
                    } else {
                        fs.unlinkSync(destPath);
                    }
                }

                // 移动文件/文件夹
                fs.renameSync(sourcePath, destPath);
                vscode.window.showInformationMessage(`已移动: ${item.label}`);
            } catch (error) {
                vscode.window.showErrorMessage(`移动失败: ${error}`);
            }
        }

        this.forceRefresh();
    }
}

class FileItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly resourceUri: vscode.Uri,
        public readonly isDirectory: boolean,
        public readonly modifiedDate?: Date,
        public readonly fileSize?: number,
        public readonly isWorkspaceFolder: boolean = false
    ) {
        super(
            label,
            isDirectory ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
        );

        const config = vscode.workspace.getConfiguration('fileInfoDecorator');
        const showSize = config.get<boolean>('showSize', true);
        const showDate = config.get<boolean>('showDate', true);
        const dateFormat = config.get<string>('dateFormat', 'YYYY/M/D HH:mm');

        // 构建描述文本
        const parts: string[] = [];
        
        if (showDate && modifiedDate) {
            parts.push(this.formatDate(modifiedDate, dateFormat));
        }
        
        if (showSize && fileSize !== undefined && !isDirectory) {
            parts.push(this.formatSize(fileSize));
        }

        if (parts.length > 0) {
            this.description = parts.join(', ');
        }

        // 设置图标 - 使用ThemeIcon以获得原生样式
        if (isWorkspaceFolder) {
            this.iconPath = new vscode.ThemeIcon('root-folder');
        } else if (isDirectory) {
            this.iconPath = vscode.ThemeIcon.Folder;
        } else {
            // 根据文件扩展名使用不同的图标
            this.iconPath = vscode.ThemeIcon.File;
        }

        // 设置资源URI，这样VSCode会自动应用文件图标主题
        this.resourceUri = resourceUri;

        // 设置命令
        if (!isDirectory) {
            this.command = {
                command: 'fileInfoDecorator.openFile',
                title: 'Open File',
                arguments: [resourceUri]
            };
        }

        // 设置工具提示
        this.tooltip = this.buildTooltip();

        // 设置上下文值，用于菜单显示
        this.contextValue = isDirectory ? 'folder' : 'file';
        
        // 设置为可选中状态
        this.id = resourceUri.toString();
    }

    private buildTooltip(): string {
        const lines: string[] = [];
        lines.push(`路径: ${this.resourceUri.fsPath}`);
        
        if (this.modifiedDate) {
            lines.push(`修改时间: ${this.modifiedDate.toLocaleString('zh-CN')}`);
        }
        
        if (this.fileSize !== undefined && !this.isDirectory) {
            lines.push(`大小: ${this.formatSize(this.fileSize)} (${this.fileSize.toLocaleString()} 字节)`);
        }
        
        if (this.isDirectory) {
            lines.push(`类型: 文件夹`);
        }
        
        return lines.join('\n');
    }

    private formatDate(date: Date, format: string): string {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return format
            .replace('YYYY', year.toString())
            .replace('YY', year.toString().slice(-2))
            .replace('MM', month.toString().padStart(2, '0'))
            .replace('M', month.toString())
            .replace('DD', day.toString().padStart(2, '0'))
            .replace('D', day.toString())
            .replace('HH', hours.toString().padStart(2, '0'))
            .replace('mm', minutes.toString().padStart(2, '0'))
            .replace('ss', seconds.toString().padStart(2, '0'));
    }

    private formatSize(bytes: number): string {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'kB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// 辅助函数：复制目录
function copyDirectory(source: string, destination: string): void {
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }

    const entries = fs.readdirSync(source, { withFileTypes: true });

    for (const entry of entries) {
        const sourcePath = path.join(source, entry.name);
        const destPath = path.join(destination, entry.name);

        if (entry.isDirectory()) {
            copyDirectory(sourcePath, destPath);
        } else {
            fs.copyFileSync(sourcePath, destPath);
        }
    }
}

export function deactivate() {}
